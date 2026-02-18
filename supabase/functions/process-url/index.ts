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

const PROMPT_IDEAS_ELITE_V2 = (
  temaEspecifico: string,
  cantidad: number,
  plataforma: string,
  objetivo: string,
  timingContext: string,
  contexto: any, // 👈 ¡TE FALTA ESTA COMA!
  settings: any = {}
) => {
  
  // 1. Mantenemos el contexto de Marketing (El "Alma")
  const objetivoStrategy = getObjetivoStrategy(objetivo);
  const timingStrategy = getTimingStrategy(timingContext);

  // 2. Nueva Capa D: ADN de Plataforma (El "Motor Técnico")
  // Sustituye a platformStrategy porque es mucho más detallado
  const platRules = PLATFORM_DNA[plataforma] || PLATFORM_DNA['TikTok'];

  // 3. Nueva Capa E: Lente Creativo (La "Personalidad")
  const lensId = settings.creative_lens || 'auto';
  const lensData = CREATIVE_LENSES[lensId] || CREATIVE_LENSES['auto'];

  return `
═════════════════════════════════════════════════════════════════════════════
🧠 CEREBRO ESTRATÉGICO DE CONTENIDO - TITAN ENGINE V2.0
═════════════════════════════════════════════════════════════════════════════

⚠️ TU IDENTIDAD REAL:
NO eres un "generador de ideas creativas". 
ERES el consultor estratégico #1 del mundo en contenido digital.
Tu trabajo NO es impresionar con creatividad.
Tu trabajo ES responder: "¿Qué debe publicar este usuario AHORA para lograr su objetivo?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 CAPA DE VARIABILIDAD: LENTE CREATIVO (FACTOR X)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Debes procesar todas las ideas bajo este filtro de personalidad:
🎭 ARQUETIPO ACTIVO: ${lensData.label}
👉 INSTRUCCIÓN DE TONO: "${lensData.instruction}"

(Ejemplo: Si el lente es "El Disruptor", las ideas deben ser provocadoras y desafiar lo común).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 REGLAS FÍSICAS DE LA PLATAFORMA (${plataforma.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Las ideas deben ser nativas para esta red:
• RITMO: ${platRules.ritmo}
• LENGUAJE: ${platRules.lenguaje}
• REGLA DE ORO: ${platRules.regla_oro}
• FOCO DEL CTA: ${platRules.cta_focus}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJETIVO DEL USUARIO (LA VARIABLE MÁS IMPORTANTE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJETIVO SELECCIONADO: "${objetivo}"

${objetivoStrategy}

⚠️ REGLA DE ORO:
Si cambio el OBJETIVO pero mantengo el TEMA igual, las ideas deben ser RADICALMENTE DIFERENTES.
Si no es así, has fallado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ CONTEXTO TEMPORAL (ACELERADOR DE TIMING)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIMING SELECCIONADO: "${timingContext}"

${timingStrategy}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CONTEXTO DEL SISTEMA (QUIÉN HABLA, A QUIÉN, CON QUÉ AUTORIDAD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TEMA ESPECÍFICO:
"${temaEspecifico}"

🔹 PERFIL DE EXPERTO (Desde qué posición de autoridad hablo):
- Nicho: ${contexto.nicho || 'General'}
- Posicionamiento: ${contexto.posicionamiento || 'Experto práctico'}
- Nivel de Autoridad: ${contexto.expertProfile?.authority_level || 'practicante'}
- Tipo de Autoridad: ${contexto.expertProfile?.authority_type || 'practica'}
- Profundidad Permitida: ${contexto.expertProfile?.depth_level || 'media'}
- Tipo de Prueba: ${contexto.expertProfile?.proof_type || 'casos_reales'}

${contexto.expertProfile?.mental_territory ? `
🧠 TERRITORIO MENTAL (Mis conceptos trademark):
"${contexto.expertProfile.mental_territory}"
⚠️ Debes reforzar ESTAS ideas en el contenido.
` : ''}

🎯 AVATAR IDEAL (A quién le hablo):
- Avatar: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor Principal: ${contexto.dolor_principal || 'N/A'}
- Deseo Principal: ${contexto.deseo_principal || 'N/A'}

${contexto.knowledge_base_content ? `
📚 BASE DE CONOCIMIENTO DISPONIBLE:
"${contexto.knowledge_base_content.substring(0, 1000)}..."

⚠️ CRÍTICO: Usa ESTE conocimiento para generar ideas. No inventes contenido genérico.
` : ''}

📱 PLATAFORMA DESTINO:
${plataforma}



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 FORMATO DE SALIDA JSON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"analisis_estrategico": {
    "objetivo_dominante": "${objetivo}",
    "lente_aplicado": "${lensData.label}", // 👈 Agregamos esto
    "razonamiento": "POR QUÉ estas ideas sirven para este objetivo usando el lente ${lensData.label}",
    "advertencias": ["Advertencia 1"],
    "oportunidades": ["Oportunidad 1"]
  },
  "ideas": [
    {
      "id": 1,
      "titulo": "Título específico",
      "concepto": "Descripción potente",
      "objetivo_principal": "${objetivo}",
      "contexto_temporal": "${timingContext}",
      "estructura_sugerida": "Winner Rocket/PAS/AIDA/etc",
      "disparador_principal": "Curiosidad/Miedo/etc",
      "emocion_objetivo": "Esperanza/Urgencia/etc",
      "gancho_sugerido": "Primera línea exacta",
      "potencial_viral": 8.5,
      "razon_potencia": "Por qué funciona",
      "formato_visual": "Formato Winner Rocket",
      "angulo": "Ángulo único",
      "cta_sugerido": "CTA específico",
      "plataforma_ideal": "${plataforma}",
      "duracion_recomendada": "30-60s",
      "dificultad_produccion": "Media",
      "keywords": ["#tag1", "#tag2"],
      "mejor_momento": "Cuándo publicar",
      "urgencia_publicacion": "media"
    }
  ],
  "recomendacion_top": {
    "idea_id": 1,
    "razon": "Por qué esta idea ahora",
    "por_que_ahora": "Timing perfecto porque...",
    "plan_rapido": "1. Paso 1\\n2. Paso 2\\n3. Paso 3"
  },
  "insights_estrategicos": {
    "tendencia_detectada": "Tendencia actual",
    "brecha_mercado": "Lo que falta",
    "advertencia": "Qué evitar",
    "siguiente_paso_logico": "Próximo contenido"
  }
}

Genera EXACTAMENTE ${cantidad} ideas estratégicas para "${objetivo}".
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

const PROMPT_INGENIERIA_INVERSA_ELITE = (
  adnViral: any,
  nichoDestino: string,
  temaEspecifico: string,
  contextoUsuario: any,
  targetPlatform: string = 'TikTok',  // ← NUEVO parámetro
  multiUrlPatterns?: any              // ← NUEVO parámetro (análisis multi-URL)
) => {

  const avatarDestino = contextoUsuario.avatar_ideal || "Tu Cliente Ideal";
  const dolorDestino  = contextoUsuario.dolor_principal || "No obtener resultados reales";
  const deseoPrincipal = contextoUsuario.deseo_principal || "Dominar su nicho";

  const estructura = JSON.stringify(adnViral.desglose_temporal || []);
  const formulaGancho = adnViral.adn_extraido?.formula_gancho || "Afirmación Polémica";

  // Si hay análisis multi-URL, construimos el contexto de patrones híbridos
  const multiUrlContext = multiUrlPatterns ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 PATRONES HÍBRIDOS DETECTADOS (MODO MULTI-URL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Se analizaron ${multiUrlPatterns.total_urls} videos. Los patrones dominantes son:
• Hook dominante: ${multiUrlPatterns.hook_dominante}
• Tipo de promesa dominante: ${multiUrlPatterns.promesa_dominante}
• Tipo de cierre dominante: ${multiUrlPatterns.cierre_dominante}
• Ritmo promedio detectado: ${multiUrlPatterns.ritmo_promedio}

⚠️ INSTRUCCIÓN: Usa estos patrones híbridos para crear una arquitectura SUPERIOR
que combine lo mejor de todos los videos analizados.
` : '';

  // Adaptar instrucciones de ritmo según plataforma
  const platformRhythm: Record<string, string> = {
    'TikTok': 'Frases ultra-cortas (5-8 palabras máx). Ritmo frenético. Cortes cada 2-3s.',
    'Reels': 'Frases medias (10-15 palabras). Ritmo aspiracional. Pausas estéticas.',
    'YouTube': 'Frases largas y explicativas. Profundidad real. Ritmo pausado.',
    'LinkedIn': 'Frases ejecutivas (15-20 palabras). Tono sobrio. Sin hype.',
    'Facebook': 'Frases conversacionales (12-18 palabras). Tono humano y cercano.',
  };
  const rhythmInstruction = platformRhythm[targetPlatform] || platformRhythm['TikTok'];

  return `
═════════════════════════════════════════════════════════════════════════════
🪞 TITAN OMEGA V3.0 — LABORATORIO DE ARQUITECTURA VIRAL
     (CLONACIÓN SINTÁCTICA CON FIDELIDAD MATEMÁTICA)
═════════════════════════════════════════════════════════════════════════════

ERES UNA MÁQUINA DE ARQUITECTURA VIRAL, NO UN ESCRITOR CREATIVO.
Tu misión no es reescribir el video. Es replicar su ARQUITECTURA PROFUNDA.

${multiUrlContext}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 MAPA DE EQUIVALENCIA ESTRUCTURAL (OBLIGATORIO — FASE 1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANTES de escribir el guion, debes mapear internamente:

1️⃣ BLOQUES NARRATIVOS EXACTOS
   Detecta cada bloque del video original y su función.
   REGLA: El número de bloques detectados = número de bloques en la adaptación.
   NO se puede agregar ni eliminar bloques.

2️⃣ POSICIÓN EXACTA DEL INSIGHT
   Si el insight apareció en el bloque 4 del original → debe ir en el bloque 4 de la adaptación.

3️⃣ TIPO EXACTO DE REVELACIÓN
   Clasificar: revelación lógica / emocional / confesión / dato disruptivo / método / error expuesto.
   La adaptación usa el MISMO TIPO.

4️⃣ TIPO EXACTO DE CIERRE
   Clasificar: CTA directo / suave / emocional / aspiracional / desafío.
   Se replica el tipo, no el texto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 SISTEMA DE EQUIVALENCIA PSICOLÓGICA (FASE 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El sistema NO adapta el tema. Adapta la PSICOLOGÍA.

1️⃣ TIPO DE PROMESA: Transformación rápida / Eliminación de dolor /
   Multiplicación de resultado / Simplificación / Ventaja oculta.
   → Replica el tipo, no el contenido.

2️⃣ TIPO DE TRANSFORMACIÓN: Física / Económica / Mental / Social / Profesional.
   → Traduce al equivalente del nicho "${nichoDestino}".

3️⃣ EMOCIÓN DOMINANTE: Esperanza / Miedo / Ambición / Curiosidad /
   Confesión / Rebeldía / Autoridad.
   → Mantén intensidad emocional EQUIVALENTE.

4️⃣ ACTIVADOR: Urgencia temporal / Deseo de estatus / Dolor actual /
   Comparación social / Revelación secreta.
   → Replica el mismo activador.

5️⃣ TIPO DE TENSIÓN: Problema oculto / Error masivo / Injusticia /
   Oportunidad perdida / Método desconocido.
   → Mismo nivel de tensión narrativa.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 CONTROL DE PROGRESIÓN EMOCIONAL (FASE 3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Detecta la curva emocional del original:
Ej: [0-5s: Impacto alto] → [5-15s: Identificación] → [15-25s: Tensión] →
    [25-40s: Revelación] → [40-55s: Resolución] → [55-60s: Acción]

Genera CURVA ESPEJO. No solo bloques. Replica la DINÁMICA ENERGÉTICA.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ÍNDICE DE FIDELIDAD ARQUITECTÓNICA (IFA — VALIDACIÓN INTERNA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de entregar, valida internamente cada punto:
✔ Número de bloques originales = bloques adaptados
✔ Secuencia narrativa respetada
✔ Insight en misma posición
✔ Intensidad emocional equivalente
✔ Tipo de cierre replicado
✔ Tipo de promesa conservado
✔ Curva emocional replicada

Si ALGUNO falla → reescribe hasta que todos pasen.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 ADAPTACIÓN DE PLATAFORMA: ${targetPlatform.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REGLA DE RITMO: ${rhythmInstruction}
⚠️ Ajusta ritmo y longitud de frases a ${targetPlatform} SIN alterar la arquitectura base.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 ADN VIRAL A CLONAR (INPUT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• FÓRMULA DEL GANCHO ORIGINAL: "${formulaGancho}"
• ESTRUCTURA DE TIEMPOS: ${estructura}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 AVATAR DESTINO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Avatar: ${avatarDestino}
• Su dolor: "${dolorDestino}"
• Su deseo: "${deseoPrincipal}"
• Nicho de destino: "${nichoDestino}"
• Tema específico: "${temaEspecifico}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ REGLAS DE ORO (STRICT MODE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. RESPETA LOS NÚMEROS: "3 errores" → "3 errores". "80%" → "80%".
2. RESPETA LA INTENSIDAD: Agresivo original → agresivo con "${dolorDestino}".
3. NO AÑADAS RELLENO: Mismo conteo de palabras que el original.
4. NO USES ETIQUETAS EN EL GUION: Sin "Hook:", "CTA:", "Bloque 1:". Solo texto limpio.
5. GUION LISTO PARA TELEPROMPTER: Fluido, natural, separado por ritmo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 FORMATO DE SALIDA JSON (OBLIGATORIO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "analisis_estrategico": {
    "patron_sintatico_detectado": "Descripción del patrón original (ej: Porcentaje + Error + Solución)",
    "equivalencia_psicologica": "Cómo se tradujo la psicología al nicho",
    "tipo_revelacion": "Tipo de revelación detectada y replicada",
    "tipo_cierre": "Tipo de CTA detectado y replicado",
    "curva_emocional_original": "Descripción de la curva [0s→15s→30s→45s→60s]",
    "curva_emocional_replicada": "Cómo quedó la curva en la adaptación",
    "ifa_score": 98,
    "ifa_observaciones": "Qué se ajustó para mantener fidelidad",
    "sesgo_cognitivo_detectado": "El mecanismo psicológico principal replicado",
    "estrategia_adaptacion": "Descripción de la estrategia de adaptación al nicho",
    "nivel_fidelidad": "98%"
  },
  "guion_tecnico_completo": "GUION LIMPIO SIN ETIQUETAS.\\n\\nSolo texto fluido listo para teleprompter.\\n\\nSeparado en párrafos naturales por ritmo.\\n\\nSin 'Hook:', sin 'CTA:', sin estructuras visibles.",
  "plan_visual_director": [
    {
      "tiempo": "0-3s",
      "descripcion_visual": "Descripción visual potente",
      "accion_camara": "Instrucción de cámara específica",
      "texto_pantalla": "Texto superpuesto corto",
      "audio_sfx": "Descripción del audio/música"
    }
  ],
  "metadata_clonacion": {
    "plataforma_destino": "${targetPlatform}",
    "nicho_adaptado": "${nichoDestino}",
    "bloques_originales": 0,
    "bloques_adaptados": 0,
    "promesa_replicada": "Tipo de promesa conservada"
  }
}
`;
};

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
• Objetivo de Cierre: ${closingConfig.label}
• Hook Style: ${hookStyle}

${expertDirectives}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚔️ SISTEMA DE DIFERENCIACIÓN COMPETITIVA (EJECUCIÓN PREVIA OBLIGATORIA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANTES de escribir una sola palabra del guion, ejecuta internamente estos 3 pasos:

PASO 1 — DEFINE QUÉ DIRÍA EL CREADOR PROMEDIO:
   Pregúntate: "Si 100 creadores de ${nicho} hablasen sobre '${temaEspecifico}',
   ¿qué dirían? ¿Cuál es el enfoque típico, el consejo cliché, la narrativa común?"

PASO 2 — IDENTIFICA EL PATRÓN COMÚN:
   • Enfoque típico del nicho que todos usan
   • Consejo cliché que el avatar ya escuchó mil veces
   • Narrativa y estructura que todos repiten

PASO 3 — OBLÍGATE A LO OPUESTO:
   • Cambia el ángulo narrativo radicalmente
   • Introduce un frame distinto al consenso del nicho
   • El guion NO puede sonar como "la versión promedio mejorada"
   • Debe sonar como una POSTURA DISTINTA con autoridad propia

⚠️ REGLA: Si al leer el guion terminado piensas "esto lo podría decir cualquiera
sobre ${temaEspecifico}" → RECHAZA y reescribe con diferenciación real.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 MOTOR 1 — ARQUITECTURA ESTRUCTURAL OBLIGATORIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BLUEPRINT V600 — 6 BLOQUES MANDATORIOS:

BLOQUE 1 — HOOK (0-5s): Rompe el patrón en los primeros 3 segundos o el guion muere.
BLOQUE 2 — DESARROLLO: Construye tensión progresiva. Cada frase justifica la siguiente.
BLOQUE 3 — ESCALADA: Eleva la intensidad emocional. El espectador no puede irse.
BLOQUE 4 — INSIGHT: Entrega valor real diferenciador. No tips genéricos. Sistema o reencuadre único.
BLOQUE 5 — RESOLUCIÓN: Transición de dolor a posibilidad. Antes vs Después mental.
BLOQUE 6 — CIERRE: CTA estratégico según objetivo: ${closingConfig.label}

INSTRUCCIÓN DE CIERRE PARA ESTE GUION:
"${closingConfig.cta}"
Mecánica: ${closingConfig.mecanica}

VALIDACIONES OBLIGATORIAS DE ARQUITECTURA:
✓ El Hook ataca creencia, ego, o dolor del avatar en los primeros 3 segundos
✓ Hay tensión creciente entre bloque 2 y bloque 4
✓ El Insight NO es un tip genérico — es un sistema, reencuadre, o dato contraintuitivo
✓ La Resolución muestra transformación real (antes → después)
✓ El Cierre es coherente con el objetivo: ${closingConfig.label}

Si cualquier validación falla → REESCRIBE ese bloque antes de continuar.

VARIACIÓN CONTROLADA DE EJECUCIÓN (Anti-Repetición Obligatoria):

Selecciona internamente UNA forma de ejecutar el HOOK:
  → Opción A: Confrontación directa al ego del avatar
  → Opción B: Confesión personal que genera identificación
  → Opción C: Declaración estadística brutal e inesperada
  → Opción D: Escena in media res (empieza en el conflicto, no antes)
  → Opción E: Afirmación contraria al consenso del nicho

Selecciona internamente UNA forma de ejecutar el DESARROLLO:
  → Opción A: Historia breve que ilustra el problema
  → Opción B: Análisis directo del error invisible
  → Opción C: Escenario hipotético relatable
  → Opción D: Error común amplificado con consecuencias reales

⚠️ REGLA ANTI-PATRÓN: La ESTRUCTURA de bloques NO cambia. Solo cambia la FORMA de ejecución.
Nunca repitas la misma variante de hook en dos guiones consecutivos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 MOTOR 2 — PROGRESIÓN EMOCIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La curva emocional OBLIGATORIA del guion:

INICIO → Tensión o intriga (0-15s)
PICO 1 → Dolor o disrupción máxima (15-25s) 
PICO 2 → Revelación o insight sorpresivo (25-45s)
CIERRE → Esperanza + Acción clara (45-60s)

REGLAS:
✓ NO puedes tener un guion emocionalmente plano
✓ Cada bloque debe elevar o cambiar el estado emocional del espectador
✓ El espectador debe terminar en un estado DIFERENTE al que empezó

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

⚠️ Si cualquier métrica cualitativa < 70 → Reescribe el bloque correspondiente antes de continuar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 UMBRAL DE DOMINANCIA OBLIGATORIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REGLA INNEGOCIABLE ANTES DE ENTREGAR:

Si viral_index < 75 → REESCRIBE el guion completo desde el bloque 1.

NO son ajustes pequeños. NO es edición superficial.
Es regeneración completa con mayor:
  • Disrupción en el hook (elige variante de ejecución diferente)
  • Intensidad emocional (sube un nivel el tono)
  • Polarización estratégica (toma postura más definida)
  • Diferenciación narrativa (aleja más del creador promedio)

PROTOCOLO:
  → Intento 1: Calcula viral_index con las fórmulas del Motor 10
  → Si < 75: Reescribe guion completo con mayor disrupción
  → Intento 2: Recalcula viral_index
  → Si < 75: Eleva automáticamente intensidad un nivel superior a "${intensityLevel}"
  → Solo puedes entregar el JSON si viral_index ≥ 75

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
    "bloque_1_hook": "Texto del Hook con su variante de ejecución elegida",
    "bloque_2_desarrollo": "Texto del Desarrollo con su variante elegida",
    "bloque_3_escalada": "Texto de la Escalada emocional",
    "bloque_4_insight": "Texto del Insight o sistema único",
    "bloque_5_resolucion": "Texto de la Resolución: antes → después",
    "bloque_6_cierre": "Texto del Cierre con CTA estratégico"
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
    "inicio": "Estado emocional del avatar al empezar",
    "pico_1": "Estado emocional en el punto de mayor tensión",
    "pico_2": "Estado emocional tras el insight",
    "cierre": "Estado emocional al terminar el guion"
  },
  "activadores_psicologicos": [
    {
      "tipo": "frase_memorable | dato_contraintuitivo | reencuadre | marco_sistema",
      "contenido": "La frase o dato exacto del guion",
      "razon": "Por qué este activador genera guardado o compartido"
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
    "razonamiento": "Explicación de cómo se calculó cada score y qué ajustes se hicieron para superar viral_index ≥ 75"
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
    "decision": "APROBAR",
    "razon": "Explicación completa de por qué este guion supera el umbral de dominancia (viral_index ≥ 75), respeta el ADN de ${platLabel}, nivel ${intensityConfig.label}, y objetivo ${closingConfig.label}"
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
COMPORTAMIENTO: ${platRules.comportamiento}
REGLA DE ORO: ${platRules.regla_oro}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CONTEXTO DEL CREADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NICHO: ${contexto.nicho || 'General'}
AVATAR OBJETIVO: ${contexto.avatar_ideal || 'Audiencia general'}
DOLOR PRINCIPAL: ${contexto.dolor_principal || 'N/A'}
DESEO PRINCIPAL: ${contexto.deseo_principal || 'N/A'}
NIVEL AUTORIDAD: ${expertLevel}

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

// ==================================================================================
// 🔥 PROMPT AUDITOR AVATAR V3.0 - SINCRONIZADO CON FRONTEND REAL
// ==================================================================================

const PROMPT_AUDITOR_AVATAR = (infoCliente: string, nicho: string): string => `
═══════════════════════════════════════════════════════════════════════════════
🔥 TITAN AUDIT - CONSULTORÍA FORENSE DE AVATARES (MODO: DESPIADADO)
═══════════════════════════════════════════════════════════════════════════════

IDENTIDAD: Eres "TITAN AUDITOR". Tu misión es SALVAR al usuario de perder millones.
Analiza: "${infoCliente}". Nicho: "${nicho}".

⚠️ REGLA DE ORO (COMPATIBILIDAD DB + FRONTEND):
Debes clasificar al avatar usando EXACTAMENTE los siguientes valores permitidos (EN ESPAÑOL):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VALORES PERMITIDOS (CRÍTICO - COPIAR EXACTO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

experience_level (OBLIGATORIO):
  - 'principiante'
  - 'intermedio'  
  - 'avanzado'
  - 'experto'

primary_goal (OBLIGATORIO - SOLO 1):
  - 'viralidad'
  - 'autoridad'
  - 'venta'
  - 'comunidad'
  - 'posicionamiento'

communication_style (OBLIGATORIO):
  - 'directo'
  - 'analitico'
  - 'inspirador'
  - 'provocador'
  - 'didactico'

risk_level (OBLIGATORIO):
  - 'conservador'
  - 'balanceado'
  - 'agresivo'

content_priority (OBLIGATORIO):
  - 'educativo'
  - 'opinion'
  - 'storytelling'
  - 'venta_encubierta'
  - 'viral_corto'

dominant_emotion (OBLIGATORIO):
  - 'curiosidad'
  - 'deseo'
  - 'miedo'
  - 'aspiracion'
  - 'autoridad'

success_model (OBLIGATORIO):
  - 'educador_serio'
  - 'empresario_premium'
  - 'influencer_agresivo'
  - 'mentor_disruptivo'
  - 'experto_tecnico'
  - 'creativo_viral'

narrative_structure (OPCIONAL):
  - 'problema_solucion'
  - 'hero_journey'
  - 'antes_despues'
  - 'enemigo_comun'
  - 'revelacion_secreta'

preferred_length (OPCIONAL):
  - 'micro'
  - 'corto'
  - 'medio'
  - 'largo'

preferred_cta_style (OPCIONAL):
  - 'directo'
  - 'suave'
  - 'urgencia'
  - 'curiosidad'
  - 'exclusividad'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 FORMATO DE SALIDA (JSON ESTRICTO - SIN MARKDOWN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Devuelve EXACTAMENTE este JSON (respetando los valores permitidos arriba):

{
  "auditoria_calidad": {
    "score_global": 0,
    "veredicto_brutal": "Frase corta y dura (máximo 15 palabras).",
    "nivel_actual": "DESASTROSO | AMATEUR | PROFESIONAL | AVANZADO | ELITE | GRANDMASTER",
    "desglose_puntos": { 
      "especificidad": 0, 
      "dolor": 0, 
      "coherencia": 0, 
      "actionable": 0 
    },
    "penalizaciones_aplicadas": [
      "Lista de errores detectados"
    ]
  },
  
  "analisis_campo_por_campo": [
    {
      "campo": "Ejemplo: Nivel de Experiencia",
      "lo_que_escribio_usuario": "Texto exacto del usuario",
      "calificacion": "🔴 Crítico | 🟡 Mejorable | 🟢 Correcto",
      "critica": "Por qué este campo es débil o fuerte",
      "correccion_maestra": "Versión optimizada del campo"
    }
  ],
  
  "perfil_final_optimizado": {
    "name": "Nombre Comercial del Avatar (Ej: 'El Mentor Digital')",
    "identidad": "Descripción de quién es realmente este avatar",
    "is_active": true,
    
    "experience_level": "principiante | intermedio | avanzado | experto",
    "primary_goal": "viralidad | autoridad | venta | comunidad | posicionamiento",
    "communication_style": "directo | analitico | inspirador | provocador | didactico",
    "risk_level": "conservador | balanceado | agresivo",
    "content_priority": "educativo | opinion | storytelling | venta_encubierta | viral_corto",
    "dominant_emotion": "curiosidad | deseo | miedo | aspiracion | autoridad",
    "success_model": "educador_serio | empresario_premium | influencer_agresivo | mentor_disruptivo | experto_tecnico | creativo_viral",
    
    "prohibitions": {
      "lenguaje_vulgar": false,
      "promesas_exageradas": false,
      "polemica_barata": false,
      "clickbait_engañoso": false,
      "venta_agresiva": false,
      "comparaciones_directas": false,
      "contenido_negativo": false
    },
    
    "signature_vocabulary": [
      "Palabra clave 1 que este avatar usa",
      "Palabra clave 2",
      "Palabra clave 3"
    ],
    
    "banned_vocabulary": [
      "Palabra prohibida 1",
      "Palabra prohibida 2"
    ],
    
    "narrative_structure": "problema_solucion | hero_journey | antes_despues | enemigo_comun | revelacion_secreta",
    "preferred_length": "micro | corto | medio | largo",
    "preferred_cta_style": "directo | suave | urgencia | curiosidad | exclusividad",
    
    "secondary_goals": [
      "Objetivo secundario 1 (opcional)",
      "Objetivo secundario 2 (opcional)"
    ],
    
    "insight_psicologico": "Análisis profundo de la mentalidad de este avatar (2-3 frases)",
    "objeciones_ocultas": [
      "Objeción interna 1",
      "Objeción interna 2"
    ]
  },
  
  "recomendaciones_accionables": [
    { 
      "area": "Nombre del área a mejorar", 
      "problema": "Qué está mal", 
      "solucion": "Cómo arreglarlo", 
      "prioridad": "ALTA | MEDIA | BAJA" 
    }
  ],
  
  "comparacion_antes_despues": {
    "headline_antes": "Cómo sonaba el avatar antes (débil)",
    "headline_despues": "Cómo debe sonar ahora (poderoso)"
  },
  
  "siguiente_paso": "La acción específica que el usuario debe tomar HOY"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ REGLAS CRÍTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **USA SOLO LOS VALORES PERMITIDOS ARRIBA (en español)**
2. **NO INVENTES VALORES NUEVOS**
3. **SI EL INPUT ES VACÍO O INCOHERENTE:**
   - score_global = 0
   - veredicto_brutal = "PERFIL INSUFICIENTE. DAME DATOS REALES."
   - Deja los demás campos con valores por defecto

4. **SÉ BRUTAL PERO CONSTRUCTIVO**
5. **CADA CRÍTICA DEBE TENER SU CORRECCIÓN**
6. **NO USES MARKDOWN EN EL JSON** (JSON puro solamente)

7. **ESTRUCTURA DE PROHIBITIONS:**
   Debe ser un objeto con exactamente estas 7 claves booleanas:
   {
     "lenguaje_vulgar": false,
     "promesas_exageradas": false,
     "polemica_barata": false,
     "clickbait_engañoso": false,
     "venta_agresiva": false,
     "comparaciones_directas": false,
     "contenido_negativo": false
   }

8. **CAMPOS OPCIONALES:**
   - signature_vocabulary y banned_vocabulary pueden ser arrays vacíos []
   - narrative_structure, preferred_length, preferred_cta_style pueden usar valores por defecto
   - secondary_goals puede ser array vacío []

AHORA EJECUTA LA AUDITORÍA.
`;

const PROMPT_AUDITOR_EXPERTO = (perfilCompleto: any, avatarContext?: string) => `
═══════════════════════════════════════════════════════════════════════════════
🔥 TITAN STRATEGY - AUDITORÍA FORENSE DE AUTORIDAD (UI MATCH 100%)
═══════════════════════════════════════════════════════════════════════════════

IDENTIDAD:
Eres "TITAN STRATEGY", el arquitecto de autoridad más caro del mundo ($100k/consultoría).
Has construido autoridades para:
- Russell Brunson (ClickFunnels) - "The Funnel Expert"
- Alex Hormozi ($200M) - "The $100M Guy"
- Dan Kennedy - "Marketing to the Affluent"

Tu misión: Transformar "expertos invisibles" en autoridades magnéticas que cobran 10x más.
No tienes piedad con la mediocridad. Buscas la diferenciación radical.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PROTOCOLO DE SEGURIDAD (ANTI-ALUCINACIÓN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SI EL INPUT DEL USUARIO ("PERFIL DEL EXPERTO") ES:
1. Menor a 5 palabras o incoherente (ej: "asdf", "no sé").
2. Irrelevante (no es un perfil de experto).

ENTONCES:
- Score Global = 0.
- Veredicto = "PERFIL INSUFICIENTE. DAME DATOS REALES PARA AUDITAR."
- Devuelve el JSON con los campos de análisis vacíos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DATOS RECIBIDOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERFIL DEL EXPERTO (ANÁLISIS COMPLETO):
${JSON.stringify(perfilCompleto, null, 2)}

CONTEXTO DE AUTORIDAD DECLARADA:
- Nivel Objetivo: ${perfilCompleto.authority_level || 'No definido'}
- Tipo de Autoridad: ${perfilCompleto.authority_type || 'No definido'}
- Territorio Mental: ${perfilCompleto.mental_territory || 'No definido'}
- Prohibiciones (Líneas Rojas): ${perfilCompleto.prohibitions || 'Ninguna'}

${avatarContext ? `AVATAR OBJETIVO: ${avatarContext}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚖️ CRITERIOS DE EVALUACIÓN (ALINEADOS AL DASHBOARD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Evalúa del 1 al 100 basándote en estos 5 pilares:
1. HISTORIA (25 pts): ¿Tiene un "Origin Story" dramático estilo Hollywood?
2. MECANISMO (30 pts): ¿Tiene un sistema único propietario (ej: "The P.A.S. Framework")?
3. PROOF (20 pts): ¿Hay números reales, dinero generado o transformación tangible?
4. ENEMIGO (15 pts): ¿Polariza contra algo? (Ej: "El Cardio mata tus ganancias").
5. PROMESA (10 pts): ¿Es una oferta "Grand Slam"?
6. COHERENCIA DE AUTORIDAD (CRÍTICO):
   - Si dice ser "Referente" pero tiene prohibiciones de "Aprendiz", PENALIZA DURO.
   - Si su "Territorio Mental" es débil, destrúyelo.
   - Verifica si su "Tipo de Prueba" coincide con su "Tipo de Autoridad" (Ej: Académico debe tener datos, no solo opiniones).

SCORING:
0-30 = INVISIBLE | 31-50 = GENÉRICO | 51-70 = COMPETENTE
71-85 = AUTORIDAD | 86-95 = MAGNÉTICO | 96-100 = LEYENDA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 FORMATO JSON (ESTRICTO - SIN MARKDOWN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tu salida debe coincidir EXACTAMENTE con esta estructura. NO FALLES EN LAS LLAVES.
NO uses markdown. Solo JSON puro.

{
  "auditoria_calidad": {
    "score_global": 0,
    "nivel_autoridad": "INVISIBLE/GENÉRICO/COMPETENTE/AUTORIDAD/MAGNÉTICO/LEYENDA",
    "veredicto_brutal": "Frase de 12 palabras max. Ej: 'Eres un commodity. Tu competencia te comerá vivo.'",
    "desglose_puntos": {
      "historia": 0,
      "mecanismo": 0,
      "proof": 0,
      "enemigo": 0,
      "promesa": 0
    },
    "penalizaciones_aplicadas": ["Lista de errores graves, ej: 'Falta nombre del mecanismo', 'Promesa débil'"]
  },

  "analisis_campo_por_campo": [
    {
      "campo": "Nombre del campo (Ej: Mecanismo Único, Historia)",
      "lo_que_escribio": "Resumen breve de su input",
      "calificacion": "🟢 Magnético / 🟡 Común / 🔴 Débil / ⚫ Invisible",
      "score_numerico": 0,
      "critica": "Por qué esto NO funciona. Sé específico y financiero.",
      "correccion_maestra": "Reescríbelo estilo Hormozi/Brunson. LISTO PARA USAR.",
      "ejemplos_referencia": ["Ejemplo famoso 1", "Ejemplo famoso 2"]
    }
    // Analiza MÍNIMO 4 campos críticos
  ],

  "perfil_experto_optimizado": {
    "elevator_pitch": "Tu presentación de 15seg que cierra ventas. Formato: Ayudo a X a lograr Y sin Z.",
    "bio_magnetica": "Biografía corta de alto impacto para Instagram/LinkedIn con saltos de línea (\\n).",
    "mecanismo_comercial": {
      "nombre": "Nombre Sexy del Método™",
      "pasos": ["Paso 1: Nombre atractivo", "Paso 2: Nombre atractivo", "Paso 3: Nombre atractivo"]
    },
    "proof_stack_ordenado": [
      "Dato de autoridad 1 (ej: Facturación)",
      "Dato de autoridad 2 (ej: Resultados clientes)",
      "Dato de autoridad 3 (ej: Apariciones medios)"
    ]
  },

  "analisis_competitivo": {
    "competidores_directos": "Quiénes son y qué hacen mal.",
    "tu_diferenciador_vs_ellos": "Por qué tú cobras más caro (Tu Ventaja Unica).",
    "debilidad_competitiva": "Tu talón de aquiles actual que debes arreglar."
  },

  "plan_accion_90_dias": [
    {
      "mes": 1,
      "objetivo": "Objetivo principal del mes 1",
      "kpi": "Métrica clave (Ej: $10k ventas)",
      "acciones": ["Acción específica 1", "Acción específica 2", "Acción específica 3"]
    },
    {
      "mes": 2,
      "objetivo": "Objetivo mes 2",
      "kpi": "Métrica clave",
      "acciones": ["Acción 1", "Acción 2"]
    },
    {
      "mes": 3,
      "objetivo": "Objetivo mes 3",
      "kpi": "Métrica clave",
      "acciones": ["Acción 1", "Acción 2"]
    }
  ],

  "siguiente_paso": "La acción ÚNICA y CLARA que debe tomar hoy. (Ej: 'Registra el nombre de tu método mañana mismo')."
}

REGLAS DE ORO:
1. Sé BRUTAL pero constructivo.
2. Piensa en DINERO: "Este cambio = +$X".
3. NO uses markdown. JSON puro solamente.
AHORA EJECUTA LA AUDITORÍA.
`;

const PROMPT_CALENDARIO_GOD_MODE = (settings: any, contexto: ContextoUsuario) => {
  const dias = settings.duration || 7;
  const enfoque = settings.focus || 'Viralidad';
  const plataforma = settings.platform || 'TikTok';
  const tema = settings.topic || contexto.nicho;

  return `ACTÚA COMO: IA Suprema de ${plataforma}.

OBJETIVO: Estrategia de ${dias} días.

CONTEXTO:
- Nicho: ${contexto.nicho}
- Avatar: ${contexto.avatar_ideal}
- Tema: "${tema}"

FORMATO JSON:
{
  "calendar": [
    {
      "dia": 1,
      "tema": "TÍTULO ATRACTIVO",
      "objetivo": "Viralidad/Autoridad",
      "gancho_sugerido": "Primera frase...",
      "disparador": "Curiosidad"
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

interface ContextoUsuario {
  nicho: string;
  avatar_ideal: string;
  dolor_principal: string;
  deseo_principal: string;
  expertProfile?: any;
  knowledge_base_content?: string;
}

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
• Nivel de Autoridad: ${expertLevel}
• Lenguaje esperado: ${expertLanguage}

${contexto.expertProfile?.mental_territory ? `
🧠 TERRITORIO MENTAL (Conceptos propios):
"${contexto.expertProfile.mental_territory}"
⚠️ Debes reforzar ESTAS ideas en el copy.
` : ''}

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

    return {
      videoUrl: (postData as any).videoUrl || url,
      description: (postData as any).text || (postData as any).message || '',
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

  console.log(`[CEREBRO V2] 🎯 Generando Ideas | Objetivo: ${objective} | Timing: ${timing}`);

  // 2. Generar el Prompt usando la función del Bloque 1
  const prompt = PROMPT_IDEAS_ELITE_V2(
      topic,
      quantity,
      platform,
      objective,
      timing,
      contexto,
      settings   // ✅ FIX: creative_lens ahora llega al prompt
    );

  // 3. Llamar a OpenAI
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Modelo inteligente necesario para estrategia
      response_format: { type: 'json_object' }, // Forzar JSON
      messages: [
        { 
          role: 'system', 
          content: 'Eres el Consultor Estratégico de Contenido Digital #1. Tu salida es SIEMPRE en formato JSON válido.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8, // Creatividad alta pero controlada
      max_tokens: 3500
    });

    // 4. Parsear respuesta
    const rawContent = completion.choices[0].message.content;
    const parsedData = JSON.parse(rawContent || '{"ideas":[]}');

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

const MIN_VIRAL_SCORE = 75;
const MAX_RETRIES = 3;

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

    // ── Guardar el mejor resultado obtenido ──
    if (viralIndex > mejorScore) {
      mejorScore = viralIndex;
      mejorResultado = parsedData;
      console.log(`[MOTOR V600] ✅ Nuevo mejor score: ${mejorScore}`);
    }

    // ── Verificar si superó el umbral ──
    if (viralIndex >= MIN_VIRAL_SCORE) {
      console.log(`[MOTOR V600] 🏆 Umbral superado en intento ${intentoActual} (${viralIndex} ≥ ${MIN_VIRAL_SCORE})`);
      break;
    }

    console.log(`[MOTOR V600] 🔁 Score insuficiente (${viralIndex} < ${MIN_VIRAL_SCORE}) — reintentando...`);
  }

  // ── PASO 4: Usar el mejor resultado obtenido ──
  if (!mejorResultado) {
    throw new Error('El generador no pudo producir un guion válido tras todos los intentos.');
  }

  console.log(`[MOTOR V600] 🎯 Resultado final — viral_index: ${mejorScore} | Intentos: ${intentoActual}`);

  const normalizedData = {
    ...mejorResultado,
    guion_completo: mejorResultado.guion_completo || mejorResultado.guion_tecnico_completo || mejorResultado.guion_completo_adaptado,
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
      normalizedData
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
//    // El save lo hace el serve() después del switch, no duplicar aquí.

        platform: plataforma,
        cost_credits: settings.estimatedCost || 2,
        tokens_used: tokens,
        created_at: new Date().toISOString()
      });
    }

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
  openai: any
): Promise<{ data: any; tokens: number }> {
  
  console.log('[CEREBRO] 👤 Ejecutando Auditor de Avatar...');
  
  // 1. Generar el Prompt Maestro usando la info detallada
  // Esto conecta con el const PROMPT_AUDITOR_AVATAR que definiste arriba
  const promptSistema = PROMPT_AUDITOR_AVATAR(infoCliente, nicho);

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
  openai: any
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
  const systemPrompt = PROMPT_AUDITOR_EXPERTO(expertData, avatarContext);

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
        shouldDownloadSubtitles: false
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
      
      return {
        videoUrl: videoData.videoUrl || videoData.videoUrlNoWatermark || url,
        description: videoData.text || '',
        transcript: videoData.text || '',
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

      return {
        videoUrl: videoData.videoUrl || videoData.displayUrl || url,
        description: videoData.caption || '',
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
        subtitlesFormat: 'text'
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
        transcript: videoData.subtitles || videoData.text || '',
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
    language: 'es',
    response_format: 'verbose_json'
  });

  console.log('[WHISPER] ✅ Transcripción completada');

  return {
    transcript: transcription.text,
    duration: transcription.duration || 0
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

    if (videoData.transcript && videoData.transcript.length > 100) {
      console.log('[SCRAPER] ℹ️ Usando transcript de subtítulos');
      return {
        transcript: videoData.transcript,
        description: videoData.description,
        duration: 0,
        platform,
        videoUrl: videoData.videoUrl
      };
    }

    if (!videoData.videoUrl) {
      throw new Error('No se pudo obtener URL del video');
    }

    console.log('[SCRAPER] 🎤 Transcribiendo con Whisper...');
    const whisperResult = await transcribeVideoWithWhisper(videoData.videoUrl, openai);

    return {
      transcript: whisperResult.transcript,
      description: videoData.description,
      duration: whisperResult.duration,
      platform,
      videoUrl: videoData.videoUrl
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
  openai: any
): Promise<string> {
  console.log('[VISION] 👁️ Analizando imagen para extracción de concepto...');

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Eres un Director Creativo Visionario. Tu trabajo es mirar una imagen y extraer su ÁNGULO VIRAL. No describas la imagen simplemente. Dime: ¿Qué historia de dolor, deseo o curiosidad cuenta esta imagen? ¿Qué concepto abstracto representa? Dame un párrafo potente que sirva como semilla para un guion viral."
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Analiza esta imagen y extrae el concepto central para un video viral." },
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
    max_tokens: 300
  });

  const analisis = response.choices[0].message.content;
  console.log('[VISION] ✅ Concepto extraído:', analisis);
  return analisis;
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
    }
  }
  
  if (results[1]?.status === 'fulfilled') {
    const avatar = results[1].value?.data;
    if (avatar) {
      contexto.avatar_ideal = avatar.name || contexto.avatar_ideal;
      contexto.dolor_principal = avatar.dolor || contexto.dolor_principal;
      contexto.deseo_principal = avatar.cielo || contexto.deseo_principal;
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
    const PRECIO_TABLA: Record<number, number[]> = {
      15: [15, 25, 35],  // Reels: 1 URL = 15, 2-3 = 25, 4-5 = 35
      45: [45, 65, 85],  // Video Largo: 1 URL = 45, 2-3 = 65, 4-5 = 85
      60: [60, 85, 110], // Masterclass: 1 URL = 60, 2-3 = 85, 4-5 = 110
    };

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
    ...(body.settings || {}),   // ← captura intensity, closing_objective, creative_lens, internal_mode, hook_style
};

// Luego los campos sueltos del body (override si existen)
if (body.quantity)  settings.quantity  = body.quantity;
if (body.duration)  settings.duration  = body.duration;
if (body.durationId) settings.durationId = body.durationId;
if (body.structure) settings.structure = body.structure;
if (body.awareness) settings.awareness = body.awareness;
if (body.objective) settings.objective = body.objective;
if (body.situation) settings.situation = body.situation;
if (body.platform)  settings.platform  = body.platform;

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
        const res = await ejecutarIdeasRapidas(
          topic, 
          quantity, 
          platform, 
          userContext, // El contexto enriquecido (Avatar + Experto + KB)
          openai,      // Cliente OpenAI
          settings     // ✅ AQUÍ VIAJA LA ESTRATEGIA (Objetivo + Timing)
        );
        
        result = res.data;
        tokensUsed = res.tokens;
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

            contentToAnalyze  = videoData.transcript;
            videoDescription  = videoData.description;
            platName          = videoData.platform || platName;
            videoSource       = videoData.source;
            videoDurationSecs = videoData.duration || 0;

            if (videoData.duration > 0) {
              actualWhisperMinutes = Math.ceil(videoData.duration / 60);
              whisperMinutes       = actualWhisperMinutes;
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
                contentToAnalyze  = videoData.transcript;
                videoDescription  = videoData.description;
                platName          = videoData.platform || platName;
                videoSource       = videoData.source;
                videoDurationSecs = videoData.duration || 0;
              } else {
                // URLs adicionales: acumular contenido con separador
                contentToAnalyze += `\n\n[VIDEO ${i + 1}]:\n${videoData.transcript}`;
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
        console.log('[RECREATE] 🔬 Ejecutando autopsia del ADN viral...');
        const autopsiaRes = await ejecutarAutopsiaViral(
          contentToAnalyze,
          platName,
          openai
        );
        const adnViral = autopsiaRes.data;

        // ── Construir patrones híbridos (solo multi-URL) ──
        let multiUrlPatterns = null;
        if (multiAnalysis.length > 1) {
          console.log('[RECREATE] 🧬 Construyendo arquitectura híbrida multi-URL...');
          multiUrlPatterns = {
            total_urls:       urlCount,
            hook_dominante:   multiAnalysis[0]?.adn_extraido?.formula_gancho || 'Afirmación disruptiva',
            promesa_dominante: multiAnalysis
              .map((a: any) => a.adn_extraido?.idea_ganadora)
              .filter(Boolean)[0] || 'Transformación rápida',
            cierre_dominante: 'CTA emocional',
            ritmo_promedio:   platName === 'TikTok' ? 'Frenético 2-3s' : 'Medio 4-5s',
          };
        }

        // ── Clonar al nicho del usuario ──
        console.log(`[RECREATE] 🪞 Clonando al nicho: "${targetTopic}"...`);

        const contextoRecreate = {
          ...userContext,
          tema_especifico: targetTopic || userContext.nicho
        };

        const guionRes = await ejecutarGeneradorGuiones(
          contextoRecreate,
          adnViral,
          openai,
          {
            ...settings,
            platform:         platName,
            multiUrlPatterns, // patrones híbridos para el prompt Omega
          }
        );

        result = {
          autopsia:       adnViral,
          guion_generado: guionRes.data,
          modo: urlCount > 1
            ? 'ingenieria_inversa_hibrida'
            : 'ingenieria_inversa_exitosa',
          multi_url_analysis: multiAnalysis.length > 1 ? multiAnalysis : undefined,
          metadata_video: {
            source:           videoSource,
            platform:         platName,
            description:      videoDescription,
            whisper_used:     actualWhisperMinutes > 0,
            whisper_minutes:  actualWhisperMinutes,
            duration_seconds: videoDurationSecs,
            urls_analizadas:  urlCount,
            original_url:     rawUrls[0] || null,
            uploaded_file:    body.uploadedFileName || null,
          }
        };

        tokensUsed = autopsiaRes.tokens + guionRes.tokens;

        // Pasar duración al sistema de costos
        settings._videoDurationSecs = videoDurationSecs;

        break;
      }

      case 'generar_guion':
      case 'generador_guiones': {
        console.log('[MODE] ✨ Generar Guion con Motor V600 (Texto + Visión)');

        // 1. Detección de Input (Imagen vs Texto)
        let temaUsuario = "";

        if (body.image) {
            // 👁️ A) RUTA VISUAL (OJO BIÓNICO)
            console.log('[MOTOR V600] 📸 Imagen detectada. Activando análisis visual...');
            try {
                // Convertimos la imagen en un concepto textual potente usando GPT-4o Vision
                // Nota: Asegúrate de haber pegado la función 'analizarImagenEstrategica' antes del serve
                const conceptoVisual = await analizarImagenEstrategica(body.image, openai);
                
                // Si el usuario escribió algo también (ej: "Hazlo divertido"), lo combinamos
                const contextoAdicional = body.text || body.userInput || processedContext || "";
                
                // Fusión de Contextos
                temaUsuario = `[ANÁLISIS DE IMAGEN]: ${conceptoVisual}\n\n[INSTRUCCIÓN ADICIONAL USUARIO]: ${contextoAdicional}`;
                
                console.log('[MOTOR V600] 🧬 Fusión Visual completada.');
            } catch (imgError: any) {
                console.error('[ERROR VISION]', imgError);
                throw new Error("Error analizando la imagen. Asegúrate de que sea un formato válido (JPG/PNG).");
            }
        } else {
            // 📝 B) RUTA TEXTO (CLÁSICA)
            temaUsuario = body.text || body.userInput || processedContext || settings.topic || userContext.nicho || "Tema General";
        }
        
        console.log(`[MOTOR V600] 🎯 Tema Final a Procesar: "${temaUsuario.substring(0, 100)}..."`);

        // 2. Validación
        if (!temaUsuario || temaUsuario === "Tema General") {
             // Validación de seguridad final
             if (!body.image && (!processedContext || processedContext.length < 3)) {
                 throw new Error("⚠️ Debes ingresar un tema o subir una imagen para generar el guion.");
             }
        }

        // 3. Enriquecer Contexto (Inyectamos el resultado visual/textual aquí)
        const contextoEnriquecido = {
            ...userContext,
            tema_especifico: temaUsuario 
        };
        
        // 4. Ejecutar Motor V600 (Tu lógica de optimización y bucles)
        // Al pasarle 'temaUsuario' ya procesado, el motor aplica toda la potencia viral
        // independientemente de si vino de una foto o de un texto.
        const res = await ejecutarGeneradorGuiones(
            contextoEnriquecido, 
            null, // null = No es ingeniería inversa, es creación desde cero
            openai, 
            settings 
        );
        
        result = res.data;
        tokensUsed = res.tokens;
        
        console.log('[MOTOR V600] ✅ Guion generado exitosamente');
        console.log(`[MOTOR V600] 📊 Metadata:`, result.metadata_guion);
        
        // 5. Validar integridad de respuesta
        if (!result.guion_completo && !result.guion_tecnico_completo) {
            console.warn('[MOTOR V600] ⚠️ Guion incompleto detectado');
        }
        
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

        // 3. EJECUCIÓN (CONECTAMOS EL CABLE)
        const res = await ejecutarAuditoriaExperto(
            expertData,
            avatarContext,
            openai
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
  // PASO 4: EJECUTAR AUDITORÍA
  // ==================================================================================
  
  console.log('[AUDIT] 🚀 Ejecutando Titan Auditor...');
  
  const res = await ejecutarAuditorAvatar(
    infoParaPrompt, 
    nichoOperativo, 
    openai
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