// ==================================================================================
// 🔐 TITAN ENGINE — CONSTANTES Y CONFIGURACIÓN GLOBAL
// Seguridad, estructuras narrativas, plataformas, lentes creativos
// ==================================================================================

import { SystemMemory } from './types.ts';

// ─── CONFIGURACIÓN DE SEGURIDAD ────────────────────────────
export const SECURITY_CONFIG = {
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

// ─── MEMORIA DEL SISTEMA (en memoria RAM, se reinicia con cada deploy) ────────
export const MEMORIA_SISTEMA: SystemMemory = {
  videos_analizados: [],
  estructuras_exitosas: [],
  hooks_alto_rendimiento: [],
  estrategias_validadas: [],
  patrones_virales: []
};

// ─── HEADERS CORS ────────────────────────────────────────────
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ==================================================================================
// 📚 BIBLIOTECAS DE CONOCIMIENTO WINNER ROCKET
// ==================================================================================

export const VIDEO_FORMATS_STR = `12 FORMATOS VISUALES WINNER ROCKET:
1.Hablando a cámara 2.Entrevista/Podcast 3.POV 4.Storytelling Cinemático 5.Demo/Tutorial 6.Testimonio 7.Gancho-Corte-Solución 8.Texto+Música 9.Vlog 10.Sketch 11.Micro-Clase 60s 12.Mito vs Realidad`;

export const MASTER_HOOKS_STR = `40 GANCHOS MAESTROS WINNER ROCKET:
1.Frame Break 2.Objeto Mágico 3.Antes-Después 4.En Movimiento 5.Sneak Peek 6.Chasquido 7.Pantalla Verde 8.Stop Scroll 9.Mito-Verdad 10.Enemigo Común 11.Negativo 12.Ridículo 13.Arrepentimiento 14.Advertencia 15.Verdad Dura 16.Miedo 17.Paradoja 18.Secreto 19.Pieza Faltante 20.Pregunta Provocadora 21.Detective 22.Acceso Denegado 23.ADN 24.What If 25.Loop 26.Comparación 27.Regla de 3 28.Dato Impactante 29.Ahorro 30.Autoridad Prestada 31.Autoridad Propia 32.Francotirador 33.Historia Personal 34.Promesa 35.Nuevo 36.Única Cosa 37.Tutorial 38.Regalo 39.Identidad 40.Reto`;

export const WINNER_ROCKET_TIMELINE = `ESTRUCTURA 60s: 0-3s HOOK | 4-10s CONTEXTO | 11-20s CONFLICTO | 21-23s LOOP | 24-35s INSIGHT | 36-50s RESOLUCIÓN | 51-60s CTA`;

export const ALGORITHM_SECRETS_STR = `SECRETOS ALGORITMOS:
TIKTOK: 3s iniciales=80% alcance | Texto frame 1 +40% retención | Sonidos trending x5
INSTAGRAM: Carousels 3x alcance | Reels loop +60% shares | 3 hashtags grandes + 2 nicho
YOUTUBE: Títulos números mejor | Loop endscreen | Subtítulos +35% retención`;

// ==================================================================================
// 🏛️ MATRIZ TITAN V500: ESTRUCTURAS NARRATIVAS Y MODOS
// ==================================================================================

export const TITAN_STRUCTURE_DEFINITIONS: any = {
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
// 🎲 LENTES CREATIVOS (CAPA E)
// ==================================================================================

export const CREATIVE_LENSES: any = {
  'auto': { label: '🎲 Aleatorio Inteligente (La IA decide)', instruction: 'Elige el ángulo que maximice el impacto emocional para este tema.' },
  'contrarian': { label: '⚡ El Disruptor', instruction: 'Enfoque: Ataca la sabiduría popular. Lleva la contraria a lo que todos dicen en el nicho.' },
  'scientific': { label: '🧪 El Científico de Datos', instruction: 'Enfoque: Basa todo en lógica, números, estudios y pruebas. Frío y calculador.' },
  'confessional': { label: '🙏 El Confesional Vulnerable', instruction: 'Enfoque: Habla desde una herida abierta o un error personal. Tono bajo y suave.' },
  'warrior': { label: '⚔️ El General de Guerra', instruction: 'Enfoque: Tono agresivo, de comando. "O estás conmigo o contra mí". Polarizante.' },
  'philosopher': { label: '🧠 El Filósofo Profundo', instruction: 'Enfoque: Cuestiona el "por qué" detrás de todo. Metafísico y existencial.' },
  'comedian': { label: '🤡 El Sarcástico', instruction: 'Enfoque: Usa ironía, exageración y humor ácido para exponer verdades.' }
};

// ==================================================================================
// 🌍 PLATFORM DNA: REGLAS DE ADAPTACIÓN POR PLATAFORMA
// ==================================================================================

export const PLATFORM_DNA: any = {
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
    duracion_ideal: 'Shorts (60s) o Largo.',
    regla_oro: 'Contexto mata brevedad. Explica el "Por qué".'
  },
  'LinkedIn': {
    ritmo: '👔 PAUSADO Y PROFESIONAL: Espacio para leer/pensar.',
    lenguaje: 'Negocios, crecimiento, lecciones de vida, corporativo.',
    estructura_visual: 'Limpia, subtítulos obligatorios.',
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

// ─── MODOS QUE NO GUARDAN EN HISTORIAL ─────────────────────
export const NO_SAVE_MODES = ['chat_avatar', 'mentor_ia', 'mentor', 'chat_expert', 'chat_mentor'];

// ─── MODOS QUE SALTAN EL MIDDLEWARE DE AVATAR ───────────────
export const SKIP_AVATAR_MODES = ['audit_avatar', 'auditar_avatar'];