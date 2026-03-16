// ====================================================================================
// 🎬 prompts/script-generator.ts
// PROMPT_GENERADOR_GUIONES  →  usado por ejecutarGeneradorGuiones y ejecutarSistemaTCA
// ejecutarGeneradorGuiones  →  handler llama: await ejecutarGeneradorGuiones(...)
// ejecutarSistemaTCA        →  handler llama: await ejecutarSistemaTCA(...)
// preAnalizarInput          →  usado internamente antes del guion
// analizarEstructuraImplicita → análisis previo de texto largo
// guardarFeedbackTCA        →  handleTcaFeedback llama: await guardarFeedbackTCA(...)
// escanearYLimpiarCliches   →  limpieza post-generación
// recalcularScoreCoherente  →  validación de scores
// validarOutputGenerador    →  validación final de output
// ====================================================================================

import { TITAN_STRUCTURE_DEFINITIONS, MASTER_HOOKS_STR, WINNER_ROCKET_TIMELINE,
         VIDEO_FORMATS_STR, ALGORITHM_SECRETS_STR, PLATFORM_DNA, CREATIVE_LENSES } from '../lib/constants.ts';

// ── CLICHÉS PROHIBIDOS ─────────────────────────────────────
const CLICHES_PROHIBIDOS = [
  "En el mundo de hoy...",
  "Es más importante que nunca...",
  "Muchas personas no saben que...",
  "Te voy a contar un secreto...",
  "Esto cambiará tu vida...",
  "Trabaja duro y sé constante",
  "El éxito no llega de la noche a la mañana",
  "Si realmente lo deseas, puedes lograrlo",
  "Hola, soy [nombre] y hoy te voy a hablar de...",
  "No te olvides de darle like y suscribirte",
  "Como siempre digo...",
  "La clave del éxito es...",
  "Eso es todo por hoy",
  "Espero que les haya gustado",
  "¡Hasta la próxima!"
];

// ── ExpertAuthoritySystem (implementación mínima) ──────────
const ExpertAuthoritySystem = {
  generateDirectives: (profile: any) => {
    if (!profile) return '';
    const { tipo_autoridad, nivel_polarizacion, nivel_agresividad } = profile;
    return `POSTURA DEL EXPERTO: ${tipo_autoridad || 'Autoridad'} | POLARIZACIÓN: ${nivel_polarizacion || 'Media'} | AGRESIVIDAD: ${nivel_agresividad || 'Moderada'}`;
  },
  applyFilter: (profile: any, type: string, data: any, platform: string) => {
    return {
      aprobado: true,
      score: 90,
      observaciones: 'Validación automática exitosa'
    };
  }
};

// ── helpers de configuración ─────────────────────────────────────
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

// ── PROMPT_GENERADOR_GUIONES ─────────────────────────────────────
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
  // 🔥 V1100: SISTEMA DE TRANSMUTACIÓN X→Y OBLIGATORIA (NO NEGOCIABLE)
  // ==================================================================================

  const TRANSMUTATION_RULES = `
🔥 SISTEMA DE TRANSMUTACIÓN X→Y OBLIGATORIA (NO NEGOCIABLE)
REGLA SUPREMA: El contenido temático del video original NO puede aparecer en la adaptación.
DEBES convertir el mecanismo psicológico a un contexto 100% diferente.

EJEMPLO DE TRANSMUTACIÓN PERFECTA:
Original: "Cómo los gatos manipulan tu mente para que les des comida"
Adaptación Abogado: "Cómo los jueces manipulan tu mente para que aceptes acuerdos injustos"
❌ PROHIBIDO: "Cómo los gatos son como clientes difíciles" (sigue hablando de gatos)
✅ OBLIGATORIO: Convertir el mecanismo de manipulación a un contexto legal real

PASOS DE TRANSMUTACIÓN:
1. Identifica el mecanismo psicológico central (ej: manipulación sutil)
2. Encuentra el equivalente en el nicho del usuario (ej: manipulación judicial)
3. Elimina TODO rastro del tema original (animales, objetos, etc.)
4. Construye la historia usando SOLO el contexto del nicho del usuario

VALIDACIÓN DE TRANSMUTACIÓN:
□ ¿El guion final NO menciona NINGÚN elemento del tema original?
□ ¿El conflicto se trasladó completamente al nicho del usuario?
□ ¿La historia es creíble y coherente en el nuevo contexto?
□ ¿Se mantuvo el mecanismo psicológico pero con ejemplos del nuevo nicho?
`;

  // ==================================================================================
  // ⚡ V1100: REGLAS DE PACING NEUROLÓGICO (PARA CADA PLATAFORMA)
  // ==================================================================================

  const PACING_RULES = `
⚡ REGLAS DE PACING NEUROLÓGICO (PARA CADA PLATAFORMA)
TIKTOK (0-60s): Máximo 8 palabras por frase hablada. Corte visual cada 2-3 segundos obligatorio.
REELS (30-90s): 12-15 palabras por frase. Pausa visual estratégica cada 15-20s para reflexión.
YOUTUBE (60s+): 18-22 palabras por frase. Transición de tono cada 30s para mantener atención.
LINKEDIN (60s+): 20-25 palabras por frase. Pausa reflexiva de 3s después de cada insight.

PATRÓN DE RETENCIÓN:
Segundos 0-3: Hook con máximo 6 palabras, ataque directo
Segundos 4-10: Contexto con máximo 40 palabras total
Segundos 11-25: Desarrollo con frases de 8-10 palabras máximo
Segundos 26-45: Clímax con frases de 6-8 palabras, ritmo acelerado
Segundos 46-60: Cierre con frase memorable de máximo 10 palabras

RESTRICCIONES DE PALABRAS POR PLATAFORMA:
${platLabel === 'TikTok' ? 'TikTok: Frases de 6-8 palabras máximo. Ritmo acelerado constante.' : 
  platLabel === 'Instagram' ? 'Instagram: Frases de 10-12 palabras. Pausas estratégicas para reflexión.' :
  platLabel === 'YouTube' ? 'YouTube: Frases de 15-18 palabras. Transiciones claras cada 30s.' :
  'LinkedIn: Frases de 18-22 palabras. Pausas reflexivas después de insights.'}
`;

  // ==================================================================================
  // 🧠 V1100: VALIDADOR DE DISONANCIA COGNITIVA (CHECKLIST OBLIGATORIO)
  // ==================================================================================

  const DISONANCE_VALIDATION = `
🧠 VALIDADOR DE DISONANCIA COGNITIVA (CHECKLIST OBLIGATORIO)
ANTES de entregar el guion, verifica que el hook cause AL MENOS UNO de estos efectos:

CRITERIOS DE DISONANCIA:
□ Rompe una creencia fundamental del avatar en los primeros 3 segundos
□ Presenta una contradicción lógica que el cerebro no puede ignorar
□ Ataca directamente el ego o identidad del espectador
□ Revela una verdad incómoda que genera incomodidad inmediata
□ Plantea una pregunta que el avatar no puede responder solo

SI NO CUMPLE AL MENOS 3 CRITERIOS → REESCRIBE EL HOOK COMPLETAMENTE
NO aceptes hooks genéricos, informativos o educativos en los primeros 3 segundos

EJEMPLOS DE HOOKS CON ALTA DISONANCIA:
❌ "Hoy vamos a hablar de cómo mejorar tu productividad" (educativo, bajo)
✅ "Todo lo que sabes sobre productividad está mal y te está arruinando" (disonancia alta)
❌ "Te voy a enseñar 3 tips para vender más" (informativo, bajo)
✅ "Los 3 'secretos' de ventas que todos repiten están matando tu negocio" (disonancia alta)

VALIDACIÓN FINAL DEL HOOK:
□ ¿El hook rompe un patrón esperado en menos de 3 segundos?
□ ¿Genera una reacción emocional inmediata (shock, indignación, curiosidad extrema)?
□ ¿Obliga al espectador a seguir escuchando para resolver la tensión creada?
□ ¿Es imposible de ignorar para el avatar ideal?
`;
  
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

  const PLATFORM_DNA_LOCAL: Record<string, any> = {

    'TikTok': {
      comportamiento: 'Exploración caótica — scroll frenético cada 1.5 segundos. Algoritmo basado en completion rate y replays.',
      porque_se_va: 'Aburrimiento en segundos 3, 15 o 45 — el algoritmo mide retención en esos 3 puntos exactos.',
      que_retiene: 'Shock inicial + loop cognitivo abierto + re-enganche en segundo 15 + pregunta que obliga a comentar.',

      estructura_obligatoria: `
═══════════════════════════════════════════════════════════════════════════
🎵 ESTRUCTURA TIKTOK V800 — ALGORITMO-FIRST (3 Exámenes de Retención)
═══════════════════════════════════════════════════════════════════════════

⚠️ REGLA SUPREMA: TikTok mide retención en segundos 3, 15 y 45. Cada uno es un examen. Si fallas uno, el algoritmo deja de distribuir.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMEN 1 — HOOK VIOLENTO (0-3s) ⚡ [PASA O MUERE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCIÓN: Detener el pulgar en 1.5s. Ataque directo a identidad o creencia.
FÓRMULAS: "Esto te está costando ${temaEspecifico} y nadie te lo dice" / "El error #1 que arruina tu ${temaEspecifico}"
REGLAS: ✓ CERO introducción ✓ Máximo 6-8 palabras ✓ Sorpresa, miedo o curiosidad extrema

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IDENTIFICACIÓN (3-6s) 🎯
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Sé exactamente cómo se siente porque yo también estuve en ${dolorPrincipal}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR INVISIBLE (7-12s) 🔍
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"El problema no eres tú. Es que te enseñaron ${temaEspecifico} completamente al revés."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMEN 2 — RE-ENGANCHE (13-15s) 🔄 [SEGUNDO EXAMEN DEL ALGORITMO]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCIÓN: Reactivar atención antes de que el scroll gane. Abrir loop que no puede cerrarse solo.
"Pero lo que casi nadie descubre es..." (NO dar respuesta todavía — el cerebro no puede irse)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSIGHT RÁPIDO (16-30s) 💡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ NO tips genéricos — SÍ marco mental con números concretos. Frases máximo 8 palabras.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMEN 3 — RE-ENGANCHE PROFUNDO (31-35s) 🔄 [TERCER EXAMEN DEL ALGORITMO]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCIÓN: El algoritmo mide si la gente sigue aquí. Segunda inyección de tensión obligatoria.
"Y lo que descubrí después fue aún más inesperado..." (escalar la promesa, no resolverla)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MINI RESOLUCIÓN (36-52s) ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Cuando apliqué esto en ${temaEspecifico}, pasé de [situación antes] a [resultado concreto con número]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CTA QUE GENERA SEÑAL ALGORÍTMICA (53-60s) 👑
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCIÓN: El comentario es la señal más poderosa para distribución masiva en TikTok.
✓ "Comenta SI o NO: ¿Esto te estaba pasando?" — obliga respuesta binaria inmediata
✓ "¿Cuántos años llevas haciendo esto sin saberlo? Ponlo en comentarios."
❌ NUNCA "dale like y suscríbete"

⚠️ PROHIBIDO EN TIKTOK:
❌ Frases largas (>10 palabras) ❌ Contexto histórico ❌ Lenguaje corporativo ❌ Múltiples ideas por bloque
`,
      tono: 'Urgente, directo, sin filtros, energético, tribal',
      ritmo: 'Frenético — micro-gancho cada 2-3 segundos',
      longitud_frase: 'Ultra corta (5-8 palabras max por frase)',
      prohibiciones: ['Introducciones largas', 'Contexto extenso', 'Lenguaje formal', 'Más de una idea por bloque']
    },

    'Reels': {
      comportamiento: 'Identidad y estatus — búsqueda de pertenencia, aspiración y contenido guardable.',
      porque_se_va: 'No me representa / No es estético / No es guardable / No genera identidad.',
      que_retiene: 'Estética + Afinidad + Frases de screenshot + Pausa visual que obliga a leer + Identidad tribal.',

      estructura_obligatoria: `
═══════════════════════════════════════════════════════════════════════════
📸 ESTRUCTURA REELS V800 — GUARDADO + IDENTIDAD (Algorithm-First)
═══════════════════════════════════════════════════════════════════════════

⚠️ REGLA SUPREMA: Instagram no busca aprender. Busca PERTENECER, ASPIRAR y GUARDAR. Los GUARDADOS valen 5x más que likes para el algoritmo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOOK DE PAUSA VISUAL (0-3s) 🛑 [LOS PRIMEROS 7s SON EL EXAMEN DEL ALGORITMO]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCIÓN: Detener el scroll con identidad inmediata. Texto sobreimpreso + frase tribal.
"Las personas que realmente dominan ${temaEspecifico} nunca hacen esto."
"Si entiendes esto sobre ${temaEspecifico}, ya estás en el 3% superior."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IDENTIFICACIÓN ASPIRACIONAL (4-10s) ✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tribu élite. Exclusividad accesible. "Los que realmente entienden ${temaEspecifico}..."
✓ Aspiracional pero no inalcanzable — tiene que sentirse alcanzable para el avatar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFLICTO EMOCIONAL RELATABLE (11-25s) 💭
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Historia corta y relatable. Vulnerabilidad controlada. "Yo también estuve ahí..."
✓ Este es el bloque que genera SHARES — debe hacer sentir "esto soy yo"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSIGHT GUARDABLE (26-42s) 💾 [DISEÑADO PARA EL BOTÓN GUARDAR]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCIÓN: Este bloque DEBE contener la frase que la gente guarda para releer después.
Dato contraintuitivo con estética mental. Filosofía de vida sobre ${temaEspecifico}.
"Guarda esto porque lo vas a necesitar cuando ${dolorPrincipal}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRASE DE SCREENSHOT (43-52s) 📸 [SEÑAL DE SHARE A STORIES]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Quote-worthy. Máximo 12 palabras. Funciona sola fuera de contexto.
Filosofía de vida sobre ${temaEspecifico} que la gente quiere compartir en su historia.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CTA DE COMUNIDAD EXCLUSIVA (53-60s) 🏆
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ "Sígueme si eres de los que entienden esto sobre ${temaEspecifico}"
✓ "Guarda esto — lo vas a necesitar" (activa la señal de guardado)
❌ NUNCA "sigue mi cuenta" genérico

⚠️ PROHIBIDO EN REELS:
❌ Agresividad excesiva ❌ Clickbait burdo ❌ Tono frío/corporativo ❌ Ritmo frenético de TikTok
`,
      tono: 'Humano, aspiracional, elegante pero accesible, cercano',
      ritmo: 'Medio — pausas estratégicas para reflexión y lectura de texto sobreimpreso',
      longitud_frase: 'Media (10-15 palabras)',
      prohibiciones: ['Agresividad excesiva', 'Clickbait burdo', 'Tono frío/corporativo']
    },

    'YouTube': {
      comportamiento: 'Intención declarada — vino a aprender algo ESPECÍFICO. Mayor tolerancia al tiempo si se cumple la promesa.',
      porque_se_va: 'No cumple la promesa del título / Es superficial / Pierde el hilo después del primer minuto.',
      que_retiene: 'Cumplir la promesa EXACTA + Profundidad real + Claridad + Final que invita al replay.',

      estructura_obligatoria: `
═══════════════════════════════════════════════════════════════════════════
📺 ESTRUCTURA YOUTUBE SHORTS V800 — PROMESA + REPLAY LOOP
═══════════════════════════════════════════════════════════════════════════

⚠️ REGLA SUPREMA: YouTube castiga el ENGAÑO y premia la ENTREGA REAL. Los Shorts se reproducen en bucle — el final debe conectar con el inicio para activar el replay.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMESA CLARA Y ESPECÍFICA (0-5s) 🎯
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Exactamente lo que promete el título. Con número o resultado concreto.
"En los próximos 60 segundos vas a entender por qué ${temaEspecifico} no funciona como crees."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREDIBILIDAD RÁPIDA (6-15s) 🏆
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Por qué importa ahora. Dato verificable o resultado propio.
La autoridad se demuestra con evidencia — no se declara con palabras.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESARROLLO PROFUNDO (16-48s) 🧠
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Paso a paso concreto con ejemplos específicos. Máximo 3 ideas clave.
✓ Explica el "por qué detrás del qué" — YouTube premia comprensión, no solo información.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CIERRE CON REPLAY LOOP (49-60s) 🔄 [ACTIVA EL BUCLE AUTOMÁTICO]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCIÓN: El final conecta con el inicio para que el algoritmo cuente el replay como nueva vista.
✓ "¿Ya lo entendiste? Vuelve al inicio y aplícalo ahora mismo."
✓ CTA de comentario que genere debate: "¿Ya sabías esto? Comenta abajo."
❌ NUNCA links externos en descripción — YouTube penaliza salidas de la plataforma.

⚠️ PROHIBIDO EN YOUTUBE:
❌ Clickbait engañoso ❌ Promesas sin cumplir ❌ Contenido superficial ❌ Links externos
`,
      tono: 'Profesional, claro, educativo pero humano, directo',
      ritmo: 'Pausado pero no aburrido — desarrollo lógico con énfasis en puntos clave',
      longitud_frase: 'Media-larga (15-25 palabras)',
      prohibiciones: ['Clickbait engañoso', 'Promesas sin cumplir', 'Contenido superficial']
    },

    'LinkedIn': {
      comportamiento: 'Autoridad profesional — busca ideas que suenen caras, frameworks reutilizables y debate intelectual.',
      porque_se_va: 'Parece humo / No aporta valor profesional real / Lenguaje demasiado coloquial.',
      que_retiene: 'Tesis controversial fundamentada + Framework propio + Pregunta que genera debate en los primeros 60 minutos.',

      estructura_obligatoria: `
═══════════════════════════════════════════════════════════════════════════
💼 ESTRUCTURA LINKEDIN V800 — AUTORIDAD INTELECTUAL + DEBATE
═══════════════════════════════════════════════════════════════════════════

⚠️ REGLA SUPREMA: LinkedIn premia COMENTARIOS en los primeros 60 minutos. Son la señal más poderosa del algoritmo. El CTA debe generar respuesta inmediata.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TESIS CONTROVERSIAL FUNDAMENTADA (0-10s) 🎯
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Afirmación fuerte que divide profesionalmente. Controversial pero fundamentable.
"La mayoría de los profesionales de ${temaEspecifico} están optimizando lo equivocado."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXTO CON CREDIBILIDAD VERIFICABLE (11-20s) 📊
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dato de industria o resultado propio comprobable. Sin autopromoción vacía.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSIGHT CONTRAINTUITIVO (21-38s) 💡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lo que la mayoría no ve. Pensamiento de segundo nivel.
"Lo que nadie menciona sobre ${temaEspecifico} es que..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAMEWORK PROPIO CON NOMBRE (39-52s) 🏗️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sistema reutilizable con nombre propio que la gente pueda citar.
"Mi sistema para ${temaEspecifico}: [NOMBRE DEL FRAMEWORK] — 3 pasos concretos:"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CTA QUE ACTIVA COMENTARIOS EN LOS PRIMEROS 60 MIN (53-60s) ⚡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCIÓN: El comentario en la primera hora es la señal más poderosa del algoritmo LinkedIn.
✓ "¿Tu empresa ya aplica esto? Sí o No en comentarios." — fácil de responder
✓ "¿Estás de acuerdo o crees que me equivoco? Debate abajo."
❌ NUNCA links en el post — LinkedIn penaliza salidas de la plataforma.

⚠️ PROHIBIDO EN LINKEDIN:
❌ Lenguaje coloquial ❌ Emojis excesivos ❌ Autopromoción directa ❌ Links en el post
`,
      tono: 'Ejecutivo, seguro, intelectual, sobrio, sin exageraciones',
      ritmo: 'Reflexivo — pausas para procesar ideas complejas',
      longitud_frase: 'Larga y estructurada (20-30 palabras)',
      prohibiciones: ['Lenguaje coloquial', 'Clickbait emocional', 'Humor forzado', 'Links en el post']
    },

    'Facebook': {
      comportamiento: 'Comunidad y conversación — busca conexión emocional, debate familiar y contenido que etiqueta amigos.',
      porque_se_va: 'No conecta emocionalmente / No invita a opinar / Parece publicidad / Ritmo demasiado agresivo.',
      que_retiene: 'Historias humanas + Pregunta polarizante segura + Opiniones que generan debate de más de 5 comentarios.',

      estructura_obligatoria: `
═══════════════════════════════════════════════════════════════════════════
📘 ESTRUCTURA FACEBOOK V800 — COMUNIDAD + DEBATE + CONVERSACIÓN
═══════════════════════════════════════════════════════════════════════════

⚠️ REGLA SUPREMA: Facebook premia debates con más de 5 comentarios. El CTA final debe generar conversación encadenada — no likes. Videos con subtítulos tienen 85% más retención (70% ve sin audio).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOOK NARRATIVO CÁLIDO (0-5s) 🤝
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pregunta o situación relatable. Tono cálido — como hablar con un amigo de confianza.
"¿Alguna vez te pasó que ${dolorPrincipal}? A mí me pasó durante años."
✓ Facebook permite 5 segundos de hook — no necesita ser tan violento como TikTok.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXTO HUMANO CON VULNERABILIDAD (6-20s) 💬
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Historia personal o aprendizaje real. Facebook tolera más contexto que TikTok.
Vulnerabilidad o error propio que genera empatía inmediata.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSIGHT CLARO SIN TECNICISMOS (21-50s) 💡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Máximo 2-3 puntos. Lenguaje de conversación real. Explica el "por qué" de forma humana.
✓ Subtítulos obligatorios — 70% ve sin audio en Facebook.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREGUNTA DE DEBATE QUE ACTIVA EL ALGORITMO (51-60s) 🔥
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCIÓN: UNA sola pregunta que divide opiniones. El debate encadenado = distribución orgánica masiva.
✓ "¿Estás de acuerdo o crees que me equivoco? Dímelo en los comentarios."
✓ "¿Conoces a alguien que necesita escuchar esto? Etiquétalo abajo."
❌ NUNCA "Comenta SI para recibir el PDF" — Facebook penaliza engagement bait explícito.

⚠️ PROHIBIDO EN FACEBOOK:
❌ Ritmo agresivo de TikTok ❌ Hype vacío ❌ Venta directa ❌ Múltiples CTAs ❌ Engagement bait
`,
      tono: 'Cálido, cercano, conversacional, auténtico, como un amigo que enseña',
      ritmo: 'Pausado y natural — respira entre ideas',
      longitud_frase: 'Media (12-20 palabras)',
      prohibiciones: ['Ritmo agresivo', 'Hype', 'Venta directa', 'Múltiples CTAs', 'Engagement bait explícito']
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
🌀 MOTOR TCA V700 — EMBUDO NARRATIVO HORIZONTAL COMPLETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TCA = Teoría Circular de Alcance
El guion NO es una pieza de contenido lineal. Es un embudo narrativo horizontal que ejecuta 4 capas:

CAPA 1 — MASIVO (Hook N2-N3)
→ El hook conecta con un deseo o dolor UNIVERSAL, no con el micronicho técnico
→ Sectores válidos: Dinero, Tiempo, Libertad, Reconocimiento, Salud, Relaciones, Crecimiento
→ El algoritmo distribuye a MILLONES porque el hook no requiere contexto previo
→ PROHIBIDO en el hook: jerga técnica, acrónimos, términos de experto, micronicho N1

CAPA 2 — FILTRADO PSICOLÓGICO (Desarrollo)
→ El conflicto filtra: atrae a los que SÍ son el avatar ideal y repele a los demás
→ Aquí aparece el ENEMIGO COMÚN — el sistema, la creencia falsa, la industria
→ El avatar siente: "esto lo escribieron exactamente para mí"
→ Este filtrado activa comentarios, guardados y compartidos

CAPA 3 — AUTORIDAD (Revelación + Insight)
→ El experto entrega el insight que solo ÉL puede dar con credibilidad
→ Aquí conecta el tema masivo (N2-N3) con el nicho específico del experto (N1)
→ La frase de oro: máximo 10 palabras, diseñada para ser screenshoteable
→ El avatar piensa: "esto no lo escuché en ningún otro lado"

CAPA 4 — CONVERSIÓN (CTA Tribal)
→ NO es un CTA genérico — es una invitación a pertenecer a una tribu
→ El avatar no siente que le venden — siente que fue elegido
→ Objetivo de cierre activo: ${closingConfig.label}
→ Mecánica de conversión: ${closingConfig.mecanica}

VALIDACIÓN TCA OBLIGATORIA ANTES DE ESCRIBIR:
□ ¿El hook está en N2–N3? Si está en micronicho técnico → REESCRIBE OBLIGATORIAMENTE
□ ¿El conflicto activa Dinero / Salud / Relaciones / Desarrollo Personal? Si no → expande
□ ¿El insight conecta el sector masivo con el nicho del experto? Si no → ajusta
□ ¿El CTA construye tribu o identidad? Si dice "dale like" → REESCRIBE
□ ¿El guion completo sigue el ciclo MASIVO → FILTRADO → AUTORIDAD → CONVERSIÓN? Si no → reestructura

PENALIZACIONES AUTOMÁTICAS:
→ Hook con jerga técnica de micronicho → -30 en mass_appeal_score
→ Sin enemigo común identificado → -20 en nivel_de_polarizacion
→ Frase de oro ausente → -25 en save_score
→ CTA genérico ("dale like") → -30 en authority_score
→ Sin filtrado psicológico en el desarrollo → -20 en viral_index

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
🔥 LEY 8 — POTENCIA MÁXIMA DEL GUION (CRITERIOS DE MILLONES DE VISTAS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para que este guion domine el algoritmo, DEBE cumplir estos 5 criterios absolutos:
1. HOOK DE 3 SEGUNDOS: Debe ser visual y verbalmente imposible de ignorar.
2. DATO QUE NADIE DICE: Una revelación que rompa el consenso de la industria.
3. PUNTO DE NO RETORNO: Un clímax narrativo en la mitad del video donde la curiosidad es máxima.
4. CIERRE QUE DEJA CICATRIZ: No solo un CTA, sino una frase que resuene en la mente del espectador horas después.
5. LA FRASE DE ORO: Una cita de máximo 10 palabras, altamente citable, diseñada explícitamente para ser "screenshot-worthy" (guardada o compartida).

Si el guion no tiene una "Frase de Oro" evidente, NO ESTÁ LISTO. Inyéctala en el Insight o la Resolución.
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
📤 FORMATO DE SALIDA JSON OBLIGATORIO (V700)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎤 teleprompter_script — EL GUION HABLADO DEFINITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este campo contiene SOLO lo que el creador dice en voz alta frente a cámara.
Usa TODO lo que procesaron los motores: el formato ${settings.formato_narrativo || 'EDUCATIVO_AUTORIDAD'}, la intensidad ${intensityConfig.label}, el sector TCA expandido, el pre-análisis P1, el perfil del experto, el conflicto real del avatar.

LONGITUD OBLIGATORIA SEGUN DURACION SELECCIONADA:
${(settings.durationId || settings.duration) === 'short' ? '- Duración: Flash 30s → MINIMO 70 palabras, IDEAL 75-80 palabras' : (settings.durationId || settings.duration) === 'long' ? '- Duración: Profundo 90s → MINIMO 200 palabras, IDEAL 210-230 palabras' : (settings.durationId || settings.duration) === 'masterclass' ? '- Duración: Masterclass → MINIMO 700 palabras, IDEAL 900-1200 palabras' : '- Duración: Estándar 60s → MINIMO 140 palabras, IDEAL 150-170 palabras'}

REGLAS ABSOLUTAS:
1. CERO etiquetas: PROHIBIDO escribir [CAPA], [TEXTO EN PANTALLA], [Zoom], [B-roll], [Hook], (pausa), etc.
2. SOLO texto hablado — exactamente lo que se dice en voz alta, nada más
3. Saltos de línea para respirar entre ideas
4. El hook debe atacar ego, miedo, dinero, tiempo o libertad — NUNCA presentarse ni dar contexto
5. Debe contener una FRASE DE ORO de máx 10 palabras que se pueda guardar como screenshot
6. El CTA final NO pide likes ni suscripción — construye tribu o genera curiosidad

VERIFICACION OBLIGATORIA antes de escribir el valor:
- Cuenta las palabras. Si no alcanza el mínimo → AMPLIA el conflicto y la revelación
- Si suena genérico → REESCRIBE con la voz específica del experto y su postura dominante

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
      "tipo": "CONTROVERSIAL",
      "descripcion": "Ataca una creencia dominante — la mitad odia, la otra ama",
      "texto": "ESCRIBE AQUI el hook CONTROVERSIAL real de 8-12 palabras para el tema '${temaEspecifico}'. Ataca una creencia dominante. Divide al instante. CERO suavizadores.",
      "retencion_predicha": 95,
      "mecanismo": "Ruptura de creencia + activación tribal",
      "tca_nivel": "N2-N3",
      "tca_sector": "Dinero / Estatus / Libertad"
    },
    {
      "tipo": "EMOCIONAL",
      "descripcion": "Conecta con el dolor más profundo del avatar — identificación total",
      "texto": "ESCRIBE AQUI el hook EMOCIONAL real de 8-12 palabras para '${temaEspecifico}'. Espejo del dolor exacto del avatar. Sin presentación. Sin contexto.",
      "retencion_predicha": 90,
      "mecanismo": "Validación emocional + espejo del dolor + FOMO identitario",
      "tca_nivel": "N2-N3",
      "tca_sector": "Salud / Relaciones / Desarrollo Personal"
    },
    {
      "tipo": "CURIOSIDAD",
      "descripcion": "Abre un loop cognitivo que el cerebro no puede cerrar solo",
      "texto": "ESCRIBE AQUI el hook de CURIOSIDAD real de 8-12 palabras para '${temaEspecifico}'. Abre un loop cognitivo que el cerebro no puede cerrar solo.",
      "retencion_predicha": 92,
      "mecanismo": "Gap cognitivo + anticipación de revelación + loop abierto",
      "tca_nivel": "N2-N3",
      "tca_sector": "Dinero / Tiempo / Reconocimiento"
    },
    {
      "tipo": "AUTORIDAD",
      "descripcion": "Establece dominio experto desde el segundo 0 — sin presentación",
      "texto": "ESCRIBE AQUI el hook de AUTORIDAD real de 8-12 palabras para '${temaEspecifico}'. Solo este experto puede decirlo. Dominio desde el segundo 0.",
      "retencion_predicha": 85,
      "mecanismo": "Credibilidad implícita + posicionamiento de poder + prueba social",
      "tca_nivel": "N2",
      "tca_sector": "Todos los sectores masivos"
    },
    {
      "tipo": "POLARIZACION",
      "descripcion": "Divide a la audiencia en dos bandos — imposible quedar neutral",
      "texto": "ESCRIBE AQUI el hook de POLARIZACION real de 8-12 palabras para '${temaEspecifico}'. Obliga a tomar posición. Imposible quedar neutral.",
      "retencion_predicha": 94,
      "mecanismo": "Tribalismo + identidad amenazada + debate explosivo",
      "tca_nivel": "N3",
      "tca_sector": "Dinero / Estatus / Libertad / Relaciones"
    }
  ],
  "guion_completo": "NO_GENERAR",
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
  "poder_del_guion": {
    "hook_primeros_3_segundos": "El gancho exacto escrito",
    "frase_de_oro": "La frase de oro de 10 palabras extraída del guion",
    "punto_de_no_retorno": "El momento donde el usuario ya no puede dejar de ver",
    "por_que_llegara_a_millones": "Explicación psicológica de por qué este guion explotará",
    "como_supera_al_original": "Por qué esta versión es mejor que el promedio del nicho",
    "momento_mas_compartible": "Qué segundo exacto es y por qué",
    "prediccion_comentarios": "Qué van a debatir exactamente en los comentarios"
  },
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
  "teleprompter_script": "",
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


// ── helpers de validación ────────────────────────────────────────
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
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Eres un editor quirúrgico. Devuelves SOLO JSON válido.' },
        { role: 'user', content: promptLimpieza }
      ],
      temperature: 0.4,
      max_tokens: 3000
    });

    const raw = completion.choices[0].message.content || '{}';
    let resultado: any = {};
    try {
      resultado = JSON.parse(raw);
    } catch (jsonErr) {
      console.warn('[SCANNER] ⚠️ JSON truncado — intentando reparar...');
      // Reparar JSON cortado: cerrar strings y objetos abiertos
      let reparado = raw.trimEnd();
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
        resultado = JSON.parse(reparado);
        console.log('[SCANNER] ✅ JSON reparado exitosamente');
      } catch (e2) {
        console.error('[SCANNER] ❌ JSON irreparable — usando fallback mínimo');
        resultado = {
          guion_limpio: raw.substring(0, 3000),
          hook_limpio: raw.substring(0, 3000),
          reemplazos_realizados: [],
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

// ── ResultadoValidacion type definition ────────────────────────────────────────
interface ResultadoValidacion {
  aprobado: boolean;
  score_total: number;
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

  // Verificar teleprompter_script presente y con contenido real
  const teleprompterCheck = output.teleprompter_script || '';
  const teleprompterWords = teleprompterCheck.replace(/\[.*?\]/g,'').trim().split(/\s+/).filter(Boolean).length;
  if (teleprompterWords < 50) {
    fallos.push(`teleprompter_script vacío o demasiado corto: ${teleprompterWords} palabras`);
  }

  // V700: guion_completo = "NO_GENERAR" — el guion real está en teleprompter_script
  const guionCompleto = (!output.guion_completo || output.guion_completo === 'NO_GENERAR')
    ? (output.teleprompter_script || output.guion || "")
    : output.guion_completo;
  if (guionCompleto.length < 100) {
    fallos.push(`Guion demasiado corto: ${guionCompleto.length} chars (mínimo 100)`);
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


// ── analizarEstructuraImplicita ──────────────────────────────────
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


// ── preAnalizarInput ─────────────────────────────────────────────
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


// ── guardarFeedbackTCA ───────────────────────────────────────────
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


// ── ejecutarSistemaTCA ───────────────────────────────────────────
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
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: promptTCA }],
      temperature: 0.4,
      max_tokens: 2000
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

// ── ejecutarGeneradorGuiones ─────────────────────────────────────
async function ejecutarGeneradorGuiones(
  contexto: any,
  viralDNA: any | null,
  openai: any,
  settings: any = {}
): Promise<{ data: any; tokens: number }> {

  console.log('[MOTOR V600] 🔥 Iniciando generación única (sin loop)...');
  console.log(`[MOTOR V600] 📱 Plataforma: ${settings.platform || 'TikTok'}`);
  console.log(`[MOTOR V600] 🏗️ Estructura: ${settings.structure || 'winner_rocket'}`);
  console.log(`[MOTOR V600] 🎯 Tema: ${contexto.tema_especifico || contexto.nicho}`);

  let tokensTotal = 0;

  // ── PASO 1: El Estratega ──
  let promptEstrategia = '';

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

  const estrategia = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Eres un Estratega de Marketing Viral de clase mundial.' },
      { role: 'user', content: promptEstrategia }
    ],
    temperature: 0.7,
    max_tokens: 1500
  });

  const planEstrategico = estrategia.choices[0].message.content;
  tokensTotal += estrategia.usage?.total_tokens || 0;

  // ── PASO 2: El Ejecutor ──
  const systemPrompt = PROMPT_GENERADOR_GUIONES(contexto, viralDNA, settings);

  console.log(`[MOTOR V600] 🚀 Enviando prompt de ${systemPrompt.length} caracteres al LLM...`);

  // 🕐 CRONÓMETRO DE IA: AbortController para control de tiempo
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout

  console.log(`[MOTOR V600] 🔄 Llamada LLM iniciada...`);
  console.log(`[MOTOR V600] 📊 Prompt length: ${systemPrompt.length} chars`);
  
  // ====================================================================================
// 🔧 PATCH QUIRÚRGICO — prompts/script-generator.ts
//
// PROBLEMA RAÍZ:
//   El código tiene `stream: true` en `ejecutarGeneradorGuiones` PERO luego intenta
//   leer `completion.choices[0].message.content` como si fuera respuesta no-streaming.
//   En modo stream, `completion` es un AsyncIterable — NO tiene `.choices[0]`.
//   Esto lanza un TypeError silencioso → el handler lo atrapa → devuelve 400.
//
//   Bug secundario: `tokensTotal += completion.usage?.total_tokens` devuelve NaN
//   porque en modo stream `completion.usage` no existe en el objeto raíz.
//
// SOLUCIÓN:
//   Reemplazar ÚNICAMENTE el bloque de la llamada OpenAI dentro de ejecutarGeneradorGuiones
//   (aprox. líneas 820-890 del original).
//   El resto del archivo (TCA, validadores, P1-P6, exports) NO se modifica.
//
// INSTRUCCIÓN DE APLICACIÓN:
//   En tu archivo `prompts/script-generator.ts`, busca el bloque que empieza con:
//     "// Implementar streaming para evitar timeout"
//   y termina con:
//     "tokensTotal += completion.usage?.total_tokens || 0;"
//   Reemplázalo COMPLETO por el bloque marcado abajo como [BLOQUE_NUEVO].
// ====================================================================================

// ══════════════════════════════════════════════════════════════════════
// [BLOQUE_VIEJO] — ELIMINAR ESTAS ~35 LÍNEAS (buscar y reemplazar todo)
// ══════════════════════════════════════════════════════════════════════
/*
  // Implementar streaming para evitar timeout
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el Motor de Viralidad e Influencia V600.' },
      { role: 'user', content: systemPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4000,
    signal: controller.signal,
    stream: true,                                    // ← ESTE ERA EL BUG
    stream_options: { include_usage: true }
  });
  
  // Procesar streaming
  let fullContent = '';
  let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  
  for await (const chunk of completion) {
    const content = chunk.choices?.[0]?.delta?.content || '';
    if (content) {
      fullContent += content;
    }
    if (chunk.usage) {
      usage = chunk.usage;
    }
  }
  
  console.log(`[MOTOR V600] ✅ Streaming completado`);
  console.log(`[MOTOR V600] 📈 Tokens consumidos: ${usage.total_tokens}`);

  clearTimeout(timeoutId);

  tokensTotal += completion.usage?.total_tokens || 0;   // ← BUG: siempre NaN en modo stream

  let parsedData: any = {};
  try {
    parsedData = JSON.parse(completion.choices[0].message.content || '{}');  // ← CRASH: no existe en modo stream
  } catch (e) {
    console.error(`[MOTOR V600] ❌ Error parseando JSON`);
    throw new Error('Error al procesar la respuesta del LLM');
  }
*/

// ══════════════════════════════════════════════════════════════════════
// [BLOQUE_NUEVO] — PEGAR EN SU LUGAR
// ══════════════════════════════════════════════════════════════════════

  // Llamada SIN streaming — este executor es interno y no necesita SSE.
  // El streaming real hacia el frontend lo maneja handlers/script-generator.ts.
  // stream: false garantiza que completion.choices[0].message.content existe siempre.
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el Motor de Viralidad e Influencia V600.' },
      { role: 'user', content: systemPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4000,
    signal: controller.signal,
    // stream: false  ← valor por defecto, NO pasar stream:true aquí
  });

  clearTimeout(timeoutId);

  // Ahora sí completion.choices[0].message.content existe y es un string
  const rawContent = completion.choices[0]?.message?.content || '{}';
  const usageTokens = completion.usage?.total_tokens || 0;

  console.log(`[MOTOR V600] ✅ Llamada completada`);
  console.log(`[MOTOR V600] 📈 Tokens consumidos: ${usageTokens}`);

  tokensTotal += usageTokens;

  let parsedData: any = {};
  try {
    // Limpiar bloques markdown por si el modelo los incluye
    const cleanContent = rawContent.replace(/```json|```/g, '').trim();
    parsedData = JSON.parse(cleanContent);
  } catch (e) {
    console.error(`[MOTOR V600] ❌ Error parseando JSON. Primeros 200 chars: ${rawContent.substring(0, 200)}`);
    throw new Error('Error al procesar la respuesta del LLM — JSON inválido');
  }

// ══════════════════════════════════════════════════════════════════════
// FIN DEL PATCH
// Lo que viene después (validación de longitud, P4, P5, etc.) NO cambia.
// ══════════════════════════════════════════════════════════════════════


  // ── PASO 2.5: Validación de longitud del teleprompter ──
  const teleprompterRaw = parsedData.teleprompter_script || '';
  const teleprompterPalabras = teleprompterRaw.replace(/\[.*?\]/g, '').trim().split(/\s+/).filter(Boolean).length;
  const durationSel = (settings.durationId || settings.duration || 'medium');
  const minPalabras = durationSel === 'short' ? 70 : durationSel === 'long' ? 200 : durationSel === 'masterclass' ? 700 : 140;
  if (teleprompterPalabras < minPalabras) {
    console.warn(`[MOTOR V600] ⚠️ teleprompter muy corto (${teleprompterPalabras} palabras, min ${minPalabras}) — rechazando`);
    throw new Error(`Teleprompter demasiado corto: ${teleprompterPalabras} palabras, mínimo requerido: ${minPalabras}`);
  }

  // ── PASO 3: Validación obligatoria del score ──
  const scorePredictivo = parsedData.score_predictivo;

  if (!scorePredictivo) {
    console.warn(`[MOTOR V600] ⚠️ score_predictivo ausente — rechazando`);
    throw new Error('Score predictivo no disponible');
  }

  const viralIndex = scorePredictivo.viral_index;

  if (typeof viralIndex !== 'number' || isNaN(viralIndex)) {
    console.warn(`[MOTOR V600] ⚠️ viral_index no es numérico (${viralIndex}) — rechazando`);
    throw new Error('Viral index no válido');
  }

  console.log(`[MOTOR V600] 📊 viral_index: ${viralIndex}`);

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

  // ── VALIDACIÓN PROGRAMÁTICA V600 ──
  const validacion = validarOutputGenerador(parsedData);

  if (!validacion.aprobado) {
    console.log(`[MOTOR V600] ❌ Validación fallida — Calidad: ${validacion.score_total}/100`);
    console.log(`[MOTOR V600] 🔄 Motivo: ${validacion.fallos.slice(0, 2).join(' | ')}`);
    throw new Error(`Validación fallida: ${validacion.fallos.join(', ')}`);
  }

  console.log(`[MOTOR V600] ✅ Validación exitosa — Calidad: ${validacion.score_total}/100`);

  const normalizedData = {
    ...parsedData,
    guion_completo: parsedData.guion_completo || parsedData.guion_tecnico_completo || parsedData.guion_completo_adaptado,
    _anti_saturation_report: parsedData._limpieza_cliches || { cliches_detectados: [], guion_fue_reescrito: false },
    _score_verification_report: parsedData.score_predictivo?._scores_verificados || null,
    guion_tecnico_completo: parsedData.guion_tecnico_completo || parsedData.guion_completo,
    plan_visual_director: parsedData.plan_visual_director || parsedData.plan_visual,
    miniatura_dominante: parsedData.miniatura_dominante || null,
    poder_del_guion: parsedData.poder_del_guion || null,
    analisis_estrategico: {
      ...(parsedData.analisis_estrategico || {}),
      razonamiento_interno: `Motor V600 — Generación única | viral_index: ${viralIndexVerificado}`,
      intentos_realizados: 1,
      umbral_superado: viralIndexVerificado >= 85,
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


export {
  PROMPT_GENERADOR_GUIONES,
  detectContentType,
  getModoConfig,
  getPosicionamientoEsperado,
  getPlataformaRules,
  escanearYLimpiarCliches,
  recalcularScoreCoherente,
  validarOutputGenerador,
  analizarEstructuraImplicita,
  preAnalizarInput,
  guardarFeedbackTCA,
  ejecutarSistemaTCA,
  ejecutarGeneradorGuiones,
};