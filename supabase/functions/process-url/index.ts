// ==================================================================================
//  🚀 TITAN ENGINE V105 DEFINITIVO - TODAS LAS CORRECCIONES APLICADAS
// ==================================================================================
//  ✅ PROBLEMA #1 RESUELTO: Guion habla del tema específico
//  ✅ PROBLEMA #2 PREPARADO: Backend listo para vincular ideas-guiones-calendario
//  ✅ PROBLEMA #3 PREPARADO: Endpoint de auditoría de guiones
//  ✅ PROBLEMA #4 RESUELTO: Transcriptor sin errores, sin "ingeniería_inversa"
//  ✅ PROBLEMA #5 RESUELTO: AnalyzeViral devuelve datos completos
//  ✅ PROBLEMA #6 RESUELTO: Recreate adapta al nicho del usuario
//  ✅ PROBLEMA #7 RESUELTO: Auditorías cargan info de BD automáticamente
//  ✅ PROBLEMA #8 RESUELTO: Calendario devuelve formato correcto
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4'
import { ApifyClient } from 'npm:apify-client'

// DESHABILITADO - No existe el archivo
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ==================================================================================
// CONFIGURACIÓN DE SEGURIDAD
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
// NÚCLEO DE INTELIGENCIA
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
  tema_especifico?: string; // ✅ NUEVO: Para que el guion hable del tema correcto
}

const MEMORIA_SISTEMA: SystemMemory = {
  videos_analizados: [],
  estructuras_exitosas: [],
  hooks_alto_rendimiento: [],
  estrategias_validadas: [],
  patrones_virales: []
};

// ==================================================================================
// BIBLIOTECAS DE CONOCIMIENTO WINNER ROCKET
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
//  FUNCIONES DE SEGURIDAD
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
//  SISTEMA CEREBRAL - PROMPTS V300 MEJORADOS 
// ==================================================================================

// 1️⃣ IDEAS RÁPIDAS (INTACTO)
const PROMPT_IDEAS = (contexto: ContextoUsuario) => `ERES UN GENIO CREATIVO DE CONTENIDO VIRAL EN ESPAÑOL.
TU MISIÓN: Generar 10 ideas de video EXPLOSIVAS para el nicho del usuario en menos de 30 segundos.

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor: ${contexto.dolor_principal || 'N/A'}
- Deseo: ${contexto.deseo_principal || 'N/A'}
- Hooks exitosos previos: ${contexto.hooks_exitosos?.join(', ') || 'N/A'}
- Patrones virales identificados: ${contexto.patrones_virales?.join(', ') || 'N/A'}

BIBLIOTECAS DE CONOCIMIENTO:
${MASTER_HOOKS_STR}
${VIDEO_FORMATS_STR}
${ALGORITHM_SECRETS_STR}

PROTOCOLO DE GENERACIÓN:
1. Analiza el contexto completo del usuario
2. Aplica los 7 disparadores virales: Curiosidad, Miedo, Deseo, Urgencia, Identidad, Controversia, Transformación
3. Combina los patrones exitosos detectados por el sistema
4. Genera ideas que conecten con el dolor profundo del Avatar

FORMATO DE SALIDA JSON ESTRICTO:
{
  "ideas": [
    {
      "id": 1,
      "titulo": "Título impactante del video (Max 60 caracteres)",
      "concepto": "Descripción de la idea en 1 frase",
      "disparador_principal": "Curiosidad/Miedo/Deseo/etc",
      "gancho_sugerido": "Primera línea potente del video",
      "potencial_viral": 8.5,
      "razon_potencia": "Por qué esta idea puede explotar",
      "formato_visual": "Uno de los 12 formatos Winner Rocket"
    }
  ],
  "recomendacion_top": {
    "idea_id": 3,
    "razon": "Explicación de por qué esta es la mejor opción ahora"
  }
}

⚠️ INSTRUCCIÓN CRÍTICA: Todas las ideas deben estar en ESPAÑOL NEUTRO y ser específicas para el nicho del usuario.`;

// 2️⃣ AUTOPSIA VIRAL (MEJORADO - CORRECCIÓN #5)
const PROMPT_AUTOPSIA_VIRAL = (platform: string) => `ERES EL FORENSE DE VIRALIDAD #1 DEL MUNDO.
TU MISIÓN: Deconstruir videos virales hasta sus componentes atómicos y extraer el ADN replicable.

INSTRUCCIONES CRÍTICAS:
1. IGNORA el contenido superficial (de qué habla el video)
2. ENFÓCATE en la estructura (cómo está construido)
3. EXTRAE los mecanismos psicológicos (por qué funciona)
4. TRADUCE todo a fórmulas replicables

PLATAFORMA: ${platform}

PROTOCOLO DE SECUENCIACIÓN (6 CAPAS):

CAPA 1: ADN DEL GANCHO (0-3s)
- Tipo de disparador exacto: (Curiosidad/Miedo/Identidad/Shock/Patrón-Interrupción)
- Fórmula estructural: [ELEMENTO 1] + [ELEMENTO 2]
- Mecanismo psicológico activado: Por qué el cerebro no puede parar de ver
- Score de retención predicho: 0-100

CAPA 2: ARQUITECTURA DE RETENCIÓN (Toda la duración)
- Timeline de Micro-Hooks: Qué mantiene enganchado cada 5-7 segundos
- Brechas de información: Cuándo se abren preguntas y cuándo se cierran
- Curva de tensión emocional: Mapa de altos y bajos
- Puntos de posible abandono: Dónde la gente podría irse

CAPA 3: ESTRUCTURA NARRATIVA
- Framework identificado: (PAS / Héroe / Antes-Después / Problema-Solución / Mito vs Realidad)
- Desglose en actos: Inicio, desarrollo, clímax, resolución
- Por qué funciona esta estructura: Biología y psicología detrás

CAPA 4: ADN DE PRODUCCIÓN
- Ritmo de cortes: Cada cuántos segundos cambia la escena
- Movimiento de cámara: Estático/Dinámico/Combinado
- Uso de B-Roll: Cuándo y por qué
- Elementos visuales clave: Texto en pantalla, overlays, efectos

CAPA 5: SEÑALES ALGORÍTMICAS
- Táctica de watch time: Cómo maximiza el tiempo de visualización
- Hooks de engagement: Qué dispara comentarios/likes/shares
- SEO y discoverability: Keywords, hashtags, momento de publicación

CAPA 6: BLUEPRINT DE REPLICACIÓN
- Fórmula exacta extraída del video
- Cómo adaptar al nicho del usuario sin copiar
- Variaciones para testear
- Trampas que evitar

BIBLIOTECAS DE CONOCIMIENTO:
${MASTER_HOOKS_STR}
${WINNER_ROCKET_TIMELINE}
${ALGORITHM_SECRETS_STR}

⚠️ REGLA ULTRA CRÍTICA: Debes devolver un JSON COMPLETO Y VÁLIDO con TODAS las secciones.
NO devuelvas respuestas vacías o incompletas.

FORMATO DE SALIDA JSON ESTRICTO (TODAS LAS SECCIONES OBLIGATORIAS):
{
  "score_viral": {
    "potencial_total": 9.2,
    "factores_exito": ["Factor 1 específico", "Factor 2 específico", "Factor 3 específico"],
    "nivel_replicabilidad": "Alta"
  },
  "adn_extraido": {
    "idea_ganadora": "La idea central en una frase potente y específica",
    "disparador_psicologico": "El mecanismo mental principal que activa",
    "estructura_exacta": "PAS / Héroe / Otra",
    "formula_gancho": "[ELEMENTO 1] + [ELEMENTO 2] = Ejemplo concreto del video"
  },
  "desglose_temporal": [
    {
      "segundo": "0-3",
      "que_pasa": "Descripción específica de lo que sucede en pantalla",
      "porque_funciona": "Mecanismo psicológico específico activado",
      "replicar_como": "Instrucción clara de cómo aplicarlo"
    },
    {
      "segundo": "4-10",
      "que_pasa": "Siguiente sección del video",
      "porque_funciona": "Por qué esta sección retiene",
      "replicar_como": "Cómo replicarlo"
    }
  ],
  "patron_replicable": {
    "nombre_patron": "Nombre descriptivo y memorable del patrón",
    "formula": "PASO 1: Acción específica + PASO 2: Acción específica + PASO 3: Acción específica",
    "aplicacion_generica": "Cómo cualquiera puede usar esto en su nicho"
  },
  "produccion_deconstruida": {
    "visuales_clave": ["Elemento visual 1 específico", "Elemento visual 2 específico"],
    "ritmo_cortes": "Cada X segundos (número concreto)",
    "movimiento_camara": "Descripción específica del movimiento",
    "musica_sonido": "Tipo de audio usado y por qué funciona",
    "texto_pantalla": "Cuándo aparece y qué dice exactamente"
  },
  "insights_algoritmicos": {
    "optimizacion_retencion": "Táctica específica que usa para retención",
    "triggers_engagement": "Qué elementos disparan interacción",
    "seo_keywords": ["Keyword 1", "Keyword 2", "Keyword 3"]
  }
}

⚠️ REGLA CRÍTICA: No describas el video, DECONSTRUYE su arquitectura. Sé ESPECÍFICO en cada respuesta.`;

// ==================================================================================
// 🧬 PROMPT ELITE TOP 1 MUNDIAL - INGENIERÍA INVERSA DE CONTENIDO VIRAL
// ==================================================================================
// Este prompt REEMPLAZA el PROMPT_AUTOPSIA_VIRAL simplificado
// Ubicación: Después del primer PROMPT_AUTOPSIA_VIRAL (línea ~400)
// ==================================================================================

/**
 * PROMPT ESPECIALIZADO PARA MODO "RECREATE" (INGENIERÍA INVERSA)
 * Este prompt se activa SOLO cuando hay ADN viral Y se quiere adaptar a un nuevo nicho
 */
const PROMPT_INGENIERIA_INVERSA_ELITE = (
  adnViral: any, 
  nichoDestino: string, 
  temaEspecifico: string,
  contextoUsuario: any
) => {
  
  const avatarDestino = contextoUsuario.avatar_ideal || "Audiencia interesada en crecer";
  const dolorDestino = contextoUsuario.dolor_principal || `Frustración en ${nichoDestino}`;
  const deseoDestino = contextoUsuario.deseo_principal || `Dominar ${nichoDestino}`;

  return `
═════════════════════════════════════════════════════════════════════════════
 🧬 PROTOCOLO DE INGENIERÍA INVERSA NIVEL ELITE - TOP 1% MUNDIAL            
═════════════════════════════════════════════════════════════════════════════

ERES EL ARQUITECTO DE VIRALIDAD MÁS AVANZADO DEL PLANETA.
TU EXPERTISE: Has deconstruido +10,000 videos virales y dominás la ciencia de replicar estructuras ganadoras.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DATOS DE ENTRADA (LOS INGREDIENTES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧬 ADN VIRAL EXTRAÍDO (Video Original):
${JSON.stringify(adnViral, null, 2)}

🎯 DESTINO (Tu Nuevo Video):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nicho Destino: ${nichoDestino}
• Tema Específico: "${temaEspecifico}"
• Avatar Objetivo: ${avatarDestino}
• Dolor Principal: ${dolorDestino}
• Deseo Principal: ${deseoDestino}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 TU MISIÓN CRÍTICA (REGLAS DE ORO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️⚠️⚠️ PROTOCOLO DE CLONACIÓN EXACTA ⚠️⚠️⚠️

1. 🔬 EXTRAE LA ARQUITECTURA (NO EL CONTENIDO):
   - Identifica la ESTRUCTURA TEMPORAL (segundo a segundo)
   - Mapea los PUNTOS DE RETENCIÓN (micro-hooks cada 7-10s)
   - Detecta el ARCO EMOCIONAL (tensión → alivio → clímax)
   - Analiza el RITMO NARRATIVO (velocidad de revelación)

2. 🧠 PRESERVA LA PSICOLOGÍA (LOS MECANISMOS):
   - Mantén el MISMO TIPO DE GANCHO (pregunta/shock/promesa/estadística)
   - Conserva el MISMO FLUJO EMOCIONAL (curiosidad→miedo→esperanza)
   - Replica los MISMOS TRIGGERS MENTALES (escasez/autoridad/prueba social)
   - Usa la MISMA CURVA DE TENSIÓN (cuándo sube, cuándo baja)

3. 🎨 TRADUCE EL CONTENIDO (CAMBIA LAS PALABRAS):
   - Si el video original dice: "El 90% falla en fitness por esto"
   - Tu video dirá: "El 90% falla en ${nichoDestino} por esto"
   
   - Si el video original muestra: "Antes tenía 60kg, ahora 75kg de músculo"
   - Tu video mostrará: "Antes tenía X en ${temaEspecifico}, ahora tengo Y"
   
   - Si el video original revela: "El secreto son 3 ejercicios que nadie hace"
   - Tu video revelará: "El secreto son 3 estrategias en ${temaEspecifico} que nadie usa"

4. ⏱️ RESPETA EL TIMING (MATEMÁTICA EXACTA):
   - Si el gancho original dura 3 segundos → Tu gancho dura 3 segundos
   - Si el conflicto aparece al segundo 12 → Tu conflicto aparece al segundo 12
   - Si el loop se abre al segundo 21 → Tu loop se abre al segundo 21
   - Si la solución empieza al 25 → Tu solución empieza al 25

5. 🎯 ADAPTA AL DOLOR/DESEO DEL NUEVO AVATAR:
   - El video original habla al dolor de SU audiencia
   - Tu video debe hablar al dolor de: ${avatarDestino}
   - Conecta CADA frase con: ${dolorDestino}
   - Inspira hacia: ${deseoDestino}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 EJEMPLOS DE TRADUCCIÓN MAESTRA (APRENDE DE ESTOS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 EJEMPLO 1: Gancho Tipo Pregunta Retórica
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Video Original (Fitness):
"¿Por qué entrenas 2 horas al día y no ves resultados? Es porque..."

Tu Adaptación (${nichoDestino}):
"¿Por qué trabajas en ${temaEspecifico} todos los días y no ves resultados? Es porque..."

📌 EJEMPLO 2: Gancho Tipo Estadística Impactante
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Video Original (Finanzas):
"El 87% de las personas que invierten en bolsa pierden dinero. ¿Por qué?"

Tu Adaptación (${nichoDestino}):
"El 87% de las personas que intentan ${temaEspecifico} fracasan. ¿Por qué?"

📌 EJEMPLO 3: Conflicto (Segundo 10-20)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Video Original (Nutrición):
"Y el problema no es que comas mucho. Es que te han mentido sobre las calorías."

Tu Adaptación (${nichoDestino}):
"Y el problema no es que te falte talento en ${temaEspecifico}. Es que te han mentido sobre cómo funciona."

📌 EJEMPLO 4: Solución (Segundo 25-40)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Video Original (Productividad):
"La clave es hacer UNA sola cosa antes de las 9am. Yo llamo a esto 'La Regla del Uno'."

Tu Adaptación (${nichoDestino}):
"La clave es dominar UNA sola estrategia en ${temaEspecifico}. Yo llamo a esto 'La Regla del Uno'."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ MAPA DE TRADUCCIÓN SEGUNDO A SEGUNDO (USA ESTO COMO PLANTILLA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analiza el 'desglose_temporal' del ADN viral y construye TU versión así:

SEGUNDO 0-3 (GANCHO):
Original: [Extrae del ADN]
Función: [Qué hace psicológicamente]
Tu Adaptación: [ESCRIBE TU VERSIÓN EXACTA sobre ${temaEspecifico}]

SEGUNDO 4-10 (CONTEXTO EMPÁTICO):
Original: [Extrae del ADN]
Función: [Validar dolor/crear identificación]
Tu Adaptación: [ESCRIBE conectando con ${dolorDestino}]

SEGUNDO 11-20 (CONFLICTO/AGITACIÓN):
Original: [Extrae del ADN]
Función: [Aumentar tensión/revelar error]
Tu Adaptación: [ESCRIBE mostrando el error común en ${nichoDestino}]

SEGUNDO 21-23 (CURIOSITY LOOP):
Original: [Extrae del ADN]
Función: [Abrir loop antes de solución]
Tu Adaptación: [ESCRIBE tu loop sobre ${temaEspecifico}]

SEGUNDO 24-35 (SOLUCIÓN/INSIGHT):
Original: [Extrae del ADN]
Función: [Entregar valor/método]
Tu Adaptación: [ESCRIBE tu solución específica para ${nichoDestino}]

SEGUNDO 36-50 (PRUEBA/RESOLUCIÓN):
Original: [Extrae del ADN]
Función: [Mostrar resultado/caso de éxito]
Tu Adaptación: [ESCRIBE tu resultado en ${temaEspecifico}]

SEGUNDO 51-60 (CTA/CIERRE):
Original: [Extrae del ADN]
Función: [Posicionar autoridad/invitar a seguir]
Tu Adaptación: [ESCRIBE tu CTA sobre ${nichoDestino}]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 PROHIBICIONES ABSOLUTAS (NUNCA HAGAS ESTO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ NO copies el contenido literal del video original
❌ NO uses ejemplos del nicho original (fitness/finanzas/etc)
❌ NO cambies el orden de las secciones
❌ NO agregues pasos que el original no tiene
❌ NO quites pasos que el original sí tiene
❌ NO cambies el tipo de gancho (si es pregunta, debe ser pregunta)
❌ NO modifiques el timing (si algo pasa al 12s, debe pasar al 12s)
❌ NO uses frases genéricas ("es importante", "debes saber")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MANDAMIENTOS DE EXCELENCIA (SIEMPRE HAZ ESTO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ SÍ respeta el ADN estructural al 100%
✅ SÍ usa números y especificidad en ${temaEspecifico}
✅ SÍ mantén el mismo nivel de energía/tono
✅ SÍ conecta con ${dolorDestino} en cada sección
✅ SÍ usa lenguaje coloquial y natural
✅ SÍ escribe el texto EXACTO palabra por palabra
✅ SÍ replica los mismos triggers psicológicos
✅ SÍ mantén la misma curva emocional

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 FORMATO DE SALIDA JSON (ESTRUCTURA EXACTA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Debes devolver un JSON con esta estructura EXACTA:

{
  "metadata_clonacion": {
    "video_original_nicho": "[Nicho del video que analizaste]",
    "video_nuevo_nicho": "${nichoDestino}",
    "tema_especifico": "${temaEspecifico}",
    "arquitectura_replicada": "[Nombre de la estructura del ADN]",
    "nivel_fidelidad_estructural": "98%",
    "adaptaciones_clave": [
      "Cambio 1: De [original] a [adaptado]",
      "Cambio 2: De [original] a [adaptado]",
      "Cambio 3: De [original] a [adaptado]"
    ]
  },
  
  "analisis_pre_clonacion": {
    "patron_identificado": "[Nombre del patrón viral detectado]",
    "mecanismo_psicologico_principal": "[Trigger principal usado]",
    "estructura_temporal_original": "[Winner Rocket / PAS / AIDA / HSO / Custom]",
    "puntos_criticos_retencion": [
      "Segundo X: [Qué hace el video original]",
      "Segundo Y: [Qué hace el video original]"
    ],
    "formula_matematica": "[Ecuación del ADN: Gancho + Contexto + Conflicto...]"
  },
  
  "guion_completo_adaptado": "AQUÍ VA EL GUION COMPLETO PALABRA POR PALABRA.\\n\\nSECCIÓN POR SECCIÓN, RESPETANDO EL TIMING DEL ADN VIRAL.\\n\\n[GANCHO - 0-3s]\\n[Tu texto exacto adaptado a ${temaEspecifico}]\\n\\n[CONTEXTO - 4-10s]\\n[Tu texto exacto conectando con ${dolorDestino}]\\n\\n[CONFLICTO - 11-20s]\\n[Tu texto exacto revelando error en ${nichoDestino}]\\n\\n[LOOP - 21-23s]\\n[Tu loop exacto sobre ${temaEspecifico}]\\n\\n[SOLUCIÓN - 24-35s]\\n[Tu solución exacta para ${nichoDestino}]\\n\\n[PRUEBA - 36-50s]\\n[Tu resultado/caso en ${temaEspecifico}]\\n\\n[CTA - 51-60s]\\n[Tu cierre exacto para ${nichoDestino}]\\n\\nMÍNIMO 180-220 PALABRAS DE TEXTO HABLADO COMPLETO.",
  
  "plan_visual_adaptado": [
    {
      "tiempo": "0-3s",
      "accion_original": "[Qué hacía el video original]",
      "accion_adaptada": "[Tu adaptación visual para ${nichoDestino}]",
      "texto_pantalla": "[Texto adaptado a ${temaEspecifico}]",
      "transicion": "[Tipo de corte/efecto del original]",
      "razon_psicologica": "[Por qué esto retiene en este momento]"
    },
    {
      "tiempo": "4-10s",
      "accion_original": "[Qué hacía el video original]",
      "accion_adaptada": "[Tu adaptación visual]",
      "texto_pantalla": "[Texto adaptado]",
      "transicion": "[Corte/efecto]",
      "razon_psicologica": "[Por qué funciona]"
    }
    // ... continúa segundo a segundo hasta el final
  ],
  
  "mapa_de_traduccion": {
    "ganchos_traducidos": [
      {
        "original": "[Frase exacta del video original]",
        "adaptado": "[Tu versión para ${temaEspecifico}]",
        "tipo_gancho": "[Pregunta/Estadística/Promesa/Shock]",
        "retencion_predicha": 92
      }
    ],
    "analogias_traducidas": [
      {
        "concepto_original": "[Ejemplo del nicho original]",
        "concepto_adaptado": "[Tu ejemplo en ${nichoDestino}]",
        "razon": "[Por qué esta analogía funciona igual]"
      }
    ],
    "triggers_preservados": [
      {
        "trigger": "[Escasez/Autoridad/Curiosidad/etc]",
        "momento": "Segundo X",
        "implementacion_original": "[Cómo lo usaba el video]",
        "implementacion_adaptada": "[Cómo lo usas tú]"
      }
    ]
  },
  
  "analisis_psicologico": {
    "arco_emocional_replicado": "[Descripción del viaje emocional mantenido]",
    "gatillos_mentales_clonados": [
      "Trigger 1: [Nombre] - Implementado en segundo X",
      "Trigger 2: [Nombre] - Implementado en segundo Y"
    ],
    "puntos_criticos_retencion_nuevos": [
      "Segundo X: [Qué hace TU video en ese momento]",
      "Segundo Y: [Qué hace TU video en ese momento]"
    ],
    "nivel_fidelidad_psicologica": "96%",
    "probabilidad_viral_estimada": "80-90%",
    "score_clonacion": "9.5/10"
  },
  
  "comparativa_lado_a_lado": {
    "estructura": {
      "original": "[Descripción de la estructura del video original]",
      "adaptado": "[Descripción de TU estructura replicada]",
      "fidelidad": "98%"
    },
    "timing": {
      "original": "[Desglose segundo a segundo del original]",
      "adaptado": "[Desglose segundo a segundo de tu versión]",
      "fidelidad": "100%"
    },
    "psicologia": {
      "original": "[Triggers del video original]",
      "adaptado": "[Triggers de tu video]",
      "fidelidad": "95%"
    }
  },
  
  "validacion_calidad": {
    "checklist_clonacion": [
      { "criterio": "Timing respetado", "cumple": true, "nota": "100% fiel" },
      { "criterio": "Estructura preservada", "cumple": true, "nota": "Arquitectura idéntica" },
      { "criterio": "Triggers replicados", "cumple": true, "nota": "Psicología mantenida" },
      { "criterio": "Contenido 100% nuevo", "cumple": true, "nota": "Cero plagio" },
      { "criterio": "Adaptado al nicho destino", "cumple": true, "nota": "Totalmente relevante" }
    ],
    "nivel_maestria": "Elite",
    "confianza_exito": "95%",
    "recomendacion": "Publicar inmediatamente"
  },
  
  "notas_del_arquitecto": {
    "decisiones_clave": [
      "Decisión 1: [Por qué hiciste X adaptación]",
      "Decisión 2: [Por qué mantuviste Y elemento]"
    ],
    "optimizaciones_aplicadas": [
      "Optimización 1: [Qué mejoraste del original]",
      "Optimización 2: [Qué ajustaste para ${nichoDestino}]"
    ],
    "advertencias": [
      "Advertencia 1: [Qué tener en cuenta al grabar]",
      "Advertencia 2: [Qué NO cambiar de este guion]"
    ]
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ÚLTIMO RECORDATORIO ULTRA CRÍTICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TU TRABAJO NO ES:
❌ Crear un video nuevo desde cero
❌ Interpretar o resumir
❌ Mejorar la estructura original
❌ Cambiar el orden de las cosas

TU TRABAJO ES:
✅ Clonar la arquitectura matemáticamente
✅ Traducir el contenido al nuevo nicho
✅ Preservar la psicología al 100%
✅ Escribir el guion completo palabra por palabra
✅ Garantizar que SI el original fue viral, ESTE también lo será

PIENSA COMO UN INGENIERO INVERSO:
- El video original es un PLANO ARQUITECTÓNICO
- Tu trabajo es CONSTRUIR LA MISMA CASA pero en otro terreno
- Mismo diseño, mismos materiales, mismo orden
- SOLO cambian los ladrillos (las palabras específicas del nicho)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 EJECUTA AHORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analiza el ADN viral proporcionado.
Identifica cada segundo del video original.
Traduce matemáticamente al nuevo nicho: "${nichoDestino}".
Escribe el guion completo sobre: "${temaEspecifico}".
Conecta con el avatar: ${avatarDestino}.
Ataca el dolor: ${dolorDestino}.
Inspira hacia: ${deseoDestino}.

QUE EL RESULTADO SEA TAN POTENTE QUE EL USUARIO DIGA:
"ESTO ES EXACTAMENTE LO QUE NECESITABA. ES COMO SI HUBIERA CLONADO EL ÉXITO DEL VIDEO ORIGINAL PERO PARA MI NICHO."

¡ADELANTE, ARQUITECTO! 🔥🧬
`;
};

// ==================================================================================
// 🧠 GENERADOR DE GUIONES V400 - ULTRA MEJORADO CON CONOCIMIENTO EXPERTO
// ==================================================================================
// ✅ Funciona CON o SIN perfil de experto/avatar
// ✅ Biblioteca de conocimiento incorporada
// ✅ Compatible 100% con código existente
// ✅ Todas las variables preservadas
// ==================================================================================

const PROMPT_GENERADOR_GUIONES = (contexto: any, viralDNA: any, settings: any = {}) => {
  // ✅ Extraer tema específico
  const temaEspecifico = contexto.tema_especifico || contexto.nicho || 'General';
  
  // ✅ NUEVO: Enriquecer contexto con conocimiento experto si no hay avatar/experto
  const avatarIdeal = contexto.avatar_ideal || "Personas que buscan crecer y destacar en su área";
  const dolorPrincipal = contexto.dolor_principal || `Frustración por no obtener los resultados deseados en ${temaEspecifico}`;
  const deseoPrincipal = contexto.deseo_principal || `Dominar ${temaEspecifico} y obtener reconocimiento`;
  const enemigoComun = contexto.enemigo_comun || "Los consejos genéricos y la información superficial que no funciona";
  const nicho = contexto.nicho || temaEspecifico;
  
  // ✅ Adaptación al nicho cuando hay DNA viral
  const dnaContext = viralDNA ? `

🧬 ADN VIRAL DE REFERENCIA (ESTRUCTURA A MODELAR):
${JSON.stringify(viralDNA, null, 2)}

⚠️⚠️⚠️ INSTRUCCIÓN ULTRA CRÍTICA DE ADAPTACIÓN AL NICHO ⚠️⚠️⚠️

REGLA DE ORO: 
1. Toma SOLO la ESTRUCTURA y MECÁNICAS del video analizado (NO su contenido)
2. El contenido del guion debe ser 100% sobre: "${temaEspecifico}"
3. Dirigido al Avatar: "${avatarIdeal}"
4. Que resuelva el Dolor: "${dolorPrincipal}"
5. Todo el texto debe ser ORIGINAL y específico para "${nicho}"

EJEMPLO DE ADAPTACIÓN CORRECTA:
Video Analizado: "5 Ejercicios para Abdominales Marcados" (Fitness)
Nicho del Usuario: "Marketing Digital"
Tema Específico: "${temaEspecifico}"

❌ INCORRECTO: Hablar de ejercicios y fitness
✅ CORRECTO: Usar la misma estructura del video pero hablando de "${temaEspecifico}"

Si el video de fitness tenía:
- Gancho: "Esto es lo que NADIE te dice sobre abdominales"
Tu guion debe tener:
- Gancho: "Esto es lo que NADIE te dice sobre ${temaEspecifico}"

Si el video tenía 5 puntos sobre ejercicios:
Tu guion debe tener 5 puntos sobre "${temaEspecifico}"

¡NUNCA copies el contenido del video analizado! Solo su arquitectura.
` : `

🎯 TEMA ESPECÍFICO DEL VIDEO:
"${temaEspecifico}"

⚠️ REGLA ULTRA CRÍTICA: El guion DEBE hablar DIRECTAMENTE y EXCLUSIVAMENTE sobre "${temaEspecifico}".
NO escribas sobre temas genéricos o diferentes.
ENFÓCATE 100% EN PROFUNDIDAD en "${temaEspecifico}".
Genera contenido ESPECÍFICO, CONCRETO y ACCIONABLE.
`;
  
  const structureType = settings.structure || 'winner_rocket'; 
  const awarenessLevel = settings.awareness || 'Consciente del Problema';
  const contentObjective = settings.objective || 'Educar';
  const avatarSituation = settings.situation || 'Dolor Agudo';

  const ARCHITECTURES: Record<string, string> = {
    'winner_rocket': `
      ESTRUCTURA 'WINNER ROCKET' (7 PASOS OBLIGATORIOS):
      
      1. HOOK PODEROSO (0-3s): 
         - Usa una afirmación disruptiva, pregunta filtro o ruptura de patrón visual
         - DEBE detener el scroll inmediatamente
         - Ejemplos de fórmulas probadas:
           * "La verdad que nadie te dice sobre [TEMA]..."
           * "Si haces esto en [TEMA], estás perdiendo dinero/tiempo/oportunidades"
           * "[NÚMERO] errores que arruinan tu [RESULTADO en TEMA]"
           * "Por qué [CREENCIA COMÚN sobre TEMA] es mentira"
      
      2. CONTEXTO EMPÁTICO (4-10s): 
         - Conecta con la realidad del espectador
         - Valida su situación actual y frustraciones
         - Usa frases como: "Sé exactamente cómo te sientes...", "Seguramente has intentado...", "Te han dicho que..."
         - Crea IDENTIFICACIÓN inmediata
      
      3. CONFLICTO / AGITACIÓN (11-20s): 
         - Revela un error común, mito falso o bloqueo invisible
         - Aumenta la tensión emocional
         - Muestra las CONSECUENCIAS de seguir así
         - Ejemplo: "Y el problema no eres tú... es que te han enseñado mal desde el principio"
      
      4. CURIOSITY LOOP (21-23s): 
         - Abre una incógnita narrativa justo ANTES de la solución
         - Fórmulas probadas:
           * "Y lo que descubrí cambió todo..."
           * "Pero el secreto no es lo que crees..."
           * "Hasta que encontré esto..."
           * "Y entonces me di cuenta de algo..."
         - NO CIERRES EL LOOP INMEDIATAMENTE
      
      5. INSIGHT / SOLUCIÓN (24-35s): 
         - Entrega la enseñanza potente y específica
         - Método paso a paso O cambio de mentalidad radical
         - DEBE ser valor real, aplicable y concreto
         - Usa números y especificidad: "3 pasos", "La fórmula exacta", "El sistema que uso"
      
      6. RESOLUCIÓN / PRUEBA (36-50s): 
         - Muestra el resultado de aplicar ese conocimiento
         - Comparte una pequeña victoria o caso de éxito
         - Inspira con la transformación lograda
         - Ejemplo: "Cuando apliqué esto, [RESULTADO ESPECÍFICO]"
      
      7. CIERRE + CTA NATURAL (51-60s): 
         - Cierra con una moraleja que te posicione como autoridad
         - CTA emocional (invita a seguirte, NO a comprar)
         - Deja con ganas de más contenido
         - Ejemplo: "Sígueme para más secretos de [TEMA] que nadie te cuenta"`,

    'pas': `ESTRUCTURA 'PAS' (PROBLEMA-AGITACIÓN-SOLUCIÓN):
      
      1. PROBLEMA (0-10s): 
         - Describe el dolor específico del avatar con DETALLE SANGRIENTO
         - Usa lenguaje visceral y emocional
         - Haz que el espectador diga: "¡Eso es exactamente lo que me pasa!"
         - Ejemplo: "¿Cansado de [FRUSTRACIÓN ESPECÍFICA]? Eso es porque..."
      
      2. AGITACIÓN (11-30s): 
         - Profundiza en las CONSECUENCIAS de no solucionar el problema AHORA
         - Aumenta el dolor emocional
         - Muestra el futuro negro si sigue igual
         - Usa el miedo como motivador (sin exagerar)
         - Ejemplo: "Y cada día que pasa sin solucionarlo, estás perdiendo..."
      
      3. SOLUCIÓN (31-60s): 
         - Presenta tu método/conocimiento como la PASTILLA para ese dolor
         - Muestra el ALIVIO inmediato
         - Ofrece esperanza tangible
         - Cierra con CTA claro: "Empieza por..."`,

    'aida': `ESTRUCTURA 'AIDA' (ATENCIÓN-INTERÉS-DESEO-ACCIÓN):
      
      1. ATENCIÓN (0-5s): 
         - Impacto visual O auditivo FUERTE
         - Estadística impactante, afirmación controversial, pregunta intrigante
         - Ejemplo: "El 97% de la gente hace esto mal en [TEMA]"
      
      2. INTERÉS (6-20s): 
         - Datos curiosos, estadísticas o hechos que retengan la mente lógica
         - Construye credibilidad
         - Usa información que sorprenda
         - Ejemplo: "Estudios demuestran que [DATO ESPECÍFICO]..."
      
      3. DESEO (21-45s): 
         - Muestra los BENEFICIOS y la transformación soñada
         - Pinta el "cielo" (vida ideal)
         - Activa el PLACER, no el dolor
         - Ejemplo: "Imagina despertar sabiendo que [RESULTADO DESEADO]..."
      
      4. ACCIÓN (46-60s): 
         - Instrucción clara y directa de qué hacer
         - Pasos específicos
         - CTA simple
         - Ejemplo: "Empieza haciendo estos 3 pasos..."`,

    'hso': `ESTRUCTURA 'HSO' (HOOK-STORY-OFFER):
      
      1. HOOK (0-3s): 
         - Promesa fuerte O declaración controversial
         - Genera curiosidad inmediata
         - Ejemplo: "Hace 6 meses estaba quebrado. Hoy gano [X]. Esto fue lo que cambió..."
      
      2. STORY (4-40s): 
         - Cuenta una historia personal o del héroe
         - ARCO NARRATIVO COMPLETO:
           * INICIO: Situación inicial (relatable)
           * CONFLICTO: El problema que enfrentó
           * PUNTO DE QUIEBRE: El momento de cambio
           * TRANSFORMACIÓN: El resultado
         - Usa DETALLES específicos para credibilidad
         - Genera EMOCIÓN
      
      3. OFFER (41-60s): 
         - La lección aprendida de esa historia
         - El recurso/conocimiento que ofreces
         - CTA: Invitación a seguir tu camino
         - Ejemplo: "Y eso mismo es lo que te voy a enseñar si me sigues..."`,
      
    'bab': `ESTRUCTURA 'BAB' (BEFORE-AFTER-BRIDGE):
      
      1. BEFORE (Antes) (0-10s): 
         - Muestra el mundo actual con el problema (INFIERNO)
         - Pinta la realidad negativa actual
         - Genera empatía
         - Ejemplo: "Antes de descubrir esto, yo también [SITUACIÓN DOLOROSA]..."
      
      2. AFTER (Después) (11-30s): 
         - Muestra el mundo ideal donde el problema NO existe (CIELO)
         - Contraste emocional fuerte
         - Activa el deseo
         - Ejemplo: "Pero ahora, [RESULTADO OPUESTO POSITIVO]..."
      
      3. BRIDGE (Puente) (31-60s): 
         - Tu contenido es el PUENTE para cruzar del infierno al cielo
         - Explica CÓMO hiciste la transición
         - Ofrece el mismo camino
         - Ejemplo: "¿Cómo lo logré? Simple: [3 PASOS]..."`
  };

  const selectedStructure = ARCHITECTURES[structureType] || ARCHITECTURES['winner_rocket'];

  return `ERES EL MEJOR GUIONISTA DE CONTENIDO VIRAL Y ESTRATEGA DE PSICOLOGÍA DE MASAS DEL MUNDO.

🎓 TU EXPERTISE INCORPORADO:
- 10+ años estudiando contenido viral y psicología de audiencias
- Experto en 47+ nichos diferentes (negocios, salud, finanzas, relaciones, tecnología, educación, etc.)
- Conoces los frameworks de storytelling de Hollywood, documentales de Netflix y TED Talks
- Dominas las técnicas de copywriting de legends como Gary Halbert, Dan Kennedy, Eugene Schwartz
- Entiendes profundamente los sesgos cognitivos y triggers psicológicos
- Conoces las tendencias actuales de cada plataforma (TikTok, Instagram, YouTube, LinkedIn)

🎯 TU MISIÓN SUPREMA: 
Escribir un guion de video COMPLETO, palabra por palabra, diseñado para:
1. DETENER el scroll en los primeros 0.5 segundos
2. RETENER la atención durante todo el video
3. GENERAR deseo de seguir al creador
4. CONVERTIR espectadores en seguidores leales

${dnaContext}

=========================================
🎯 CONTEXTO DEL CREADOR
=========================================
- Nicho: ${nicho}
- Tema ESPECÍFICO del video: "${temaEspecifico}"
- Avatar Ideal: ${avatarIdeal}
- Dolor Principal del Avatar: ${dolorPrincipal}
- Deseo Principal del Avatar: ${deseoPrincipal}
- Enemigo Común (lo que rechazamos): ${enemigoComun}

=========================================
🧠 CALIBRACIÓN PSICOLÓGICA DEL CONTENIDO
=========================================

1. NIVEL DE CONSCIENCIA DE LA AUDIENCIA: "${awarenessLevel}"
   
   INSTRUCCIONES ESPECÍFICAS:
   - Si "Totalmente Inconsciente": El avatar NO sabe que tiene un problema. Usa historias y curiosidad pura. NO menciones el problema directamente.
   - Si "Consciente del Problema": El avatar SABE que sufre pero no sabe la causa. Revela el "verdadero problema oculto".
   - Si "Consciente de la Solución": El avatar sabe QUÉ necesita pero no CÓMO conseguirlo. Muestra tu método específico.
   - Si "Consciente del Producto": El avatar conoce las opciones. Diferénciate mostrando tu ángulo único.

2. OBJETIVO PRINCIPAL DEL CONTENIDO: "${contentObjective}"
   
   INSTRUCCIONES ESPECÍFICAS:
   - Si "Educar / Valor": Tono didáctico, claridad máxima, pasos específicos, ejemplos concretos.
   - Si "Inspirar / Motivar": Tono épico y emotivo, storytelling powerful, final uplifting.
   - Si "Persuadir / Vender": Tono urgente, foco en transformación, agitación + solución.
   - Si "Entretener / Viralidad": Tono dinámico, sorpresas constantes, giros narrativos.
   - Si "Romper Objeciones": Tono empático pero firme, anticipa dudas, desactiva miedos.

3. SITUACIÓN EMOCIONAL ACTUAL DEL AVATAR: "${avatarSituation}"
   
   INSTRUCCIONES ESPECÍFICAS:
   - Si "Dolor Agudo (Urgencia)": El guion debe VALIDAR ese dolor en los primeros 5 segundos. Usa lenguaje visceral.
   - Si "Miedo / Incertidumbre": Reconoce el miedo sin juzgar. Ofrece certeza y claridad.
   - Si "Deseo / Ambición": Conecta con sus aspiraciones. Pinta el futuro deseado vívidamente.
   - Si "Curiosidad Pura": Alimenta la curiosidad sin revelar todo. Usa misterio estratégico.
   - Si "Escepticismo": Anticipa las objeciones. Usa pruebas, lógica y credibilidad.

=========================================
🛠️ ARQUITECTURA NARRATIVA SELECCIONADA
=========================================
ESTRUCTURA: ${structureType.toUpperCase()}

${selectedStructure}

=========================================
📚 BIBLIOTECA DE CONOCIMIENTO EXPERTO
=========================================

TRIGGERS PSICOLÓGICOS COMPROBADOS (Úsalos estratégicamente):
1. ESCASEZ: "Pocos lo saben", "Esto no durará", "Antes de que sea tarde"
2. URGENCIA: "Ahora mismo", "Hoy", "En este momento"
3. AUTORIDAD: "Los expertos dicen", "Estudios demuestran", "Mi experiencia de X años"
4. PRUEBA SOCIAL: "Miles ya lo usan", "La mayoría no lo sabe", "Los que triunfan hacen esto"
5. RECIPROCIDAD: "Te voy a regalar", "Esto es oro puro", "Valor gratis"
6. CURIOSIDAD: "El secreto es", "Lo que nadie te dice", "La verdad oculta"
7. IDENTIDAD: "Si eres de los que...", "La gente como tú", "Los que realmente quieren..."
8. CONTRASTE: "La mayoría hace X, pero los ganadores hacen Y"
9. NARRATIVA: Cuenta historias, usa arcos emocionales, crea personajes
10. ESPECIFICIDAD: Usa números exactos, detalles concretos, casos reales

PALABRAS MAGNÉTICAS DE ALTO IMPACTO (Úsalas abundantemente):
- Poder: "secreto", "verdad", "revelación", "descubrimiento", "truco"
- Urgencia: "ahora", "inmediato", "rápido", "urgente", "antes de que"
- Exclusividad: "pocos", "nadie", "oculto", "privado", "exclusivo"
- Transformación: "cambiar", "transformar", "revolucionar", "dominar", "explotar"
- Negación: "nunca más", "olvídate de", "deja de", "elimina", "evita"
- Facilidad: "simple", "fácil", "sin esfuerzo", "automático", "probado"
- Resultados: "comprobado", "garantizado", "funciona", "éxito", "victoria"

GANCHOS VIRALES COMPROBADOS (Úsalos como inspiración):
1. "Esto es lo que NADIE te dice sobre [TEMA]..."
2. "Si haces [ACCIÓN] en [TEMA], estás perdiendo [VALOR]..."
3. "[NÚMERO] errores que arruinan tu [RESULTADO] (el #3 es mortal)"
4. "Por qué [CREENCIA COMÚN] es la razón por la que fallas en [TEMA]"
5. "Hace [TIEMPO] yo también [DOLOR]. Hoy [RESULTADO]. Esto cambió todo..."
6. "La diferencia entre [GRUPO PERDEDOR] y [GRUPO GANADOR] es esto..."
7. "¿[PREGUNTA PROVOCADORA sobre TEMA]? La respuesta te sorprenderá..."
8. "Antes vs Después de descubrir esto sobre [TEMA]..."

FÓRMULAS DE RETENCIÓN (Aplícalas cada 7-10 segundos):
- Micro-ganchos internos: "Pero espera...", "Y aquí viene lo mejor...", "Esto es clave..."
- Pattern interrupts: Cambia el tono, velocidad o intensidad
- Promesas progresivas: "En 10 segundos te diré...", "Presta atención a esto..."
- Bucles abiertos: Abre preguntas y ciérralas después
- Picos emocionales: Alterna tensión y alivio

=========================================
⚠️ REGLAS DE ORO ABSOLUTAS (NO LAS ROMPAS)
=========================================

1. **CERO RESÚMENES - GUION COMPLETO:**
   - Escribe el texto EXACTO palabra por palabra que el locutor va a leer
   - NUNCA escribas: "Explica aquí X", "Habla sobre Y", "Menciona Z"
   - SIEMPRE escribe: El texto completo, específico y listo para grabar

2. **ESPECÍFICO, NO GENÉRICO:**
   - NO digas: "Hay varios métodos para mejorar"
   - SÍ di: "Los 3 pasos exactos que uso son: primero..."
   - Usa NÚMEROS, DATOS, EJEMPLOS CONCRETOS

3. **LENGUAJE NATURAL Y COLOQUIAL:**
   - Escribe como HABLAS, no como escribes formalmente
   - Usa contracciones: "no hay" → "no hay", "para que" → "pa' que"
   - Incluye pausas naturales: "...", "¿sabes?"

4. **FORMATO LIMPIO - SIN ACOTACIONES:**
   - El campo "guion_completo" NO debe tener [corchetes de instrucciones]
   - NO incluyas "(Pausa)", "(Énfasis)", "(Música)"
   - SOLO texto que se lee en cámara

5. **TEMA ULTRA ESPECÍFICO:**
   - Habla EXCLUSIVAMENTE sobre "${temaEspecifico}"
   - NO te desvíes a temas relacionados o generales
   - PROFUNDIZA en "${temaEspecifico}" con detalles únicos

6. **CURIOSITY LOOPS ESTRATÉGICOS:**
   - Abre preguntas/intrigas cada 10-15 segundos
   - NO las cierres inmediatamente
   - Mantén al espectador pensando "¿y qué pasó?"

7. **VALOR REAL Y ACCIONABLE:**
   - Cada guion DEBE dejar al espectador con algo aplicable
   - NO teoría pura - siempre pasos concretos
   - El espectador debe pensar: "Esto lo puedo hacer YA"

8. **LONGITUD APROPIADA:**
   - MÍNIMO 150 palabras de texto hablado
   - MÁXIMO 250 palabras para videos de 60s
   - Para Masterclass: 500-800 palabras

9. **AUTENTICIDAD Y CREDIBILIDAD:**
   - Si usas datos, que sean creíbles (no inventes estadísticas imposibles)
   - Si cuentas historias, que sean verosímiles
   - Genera confianza, no escepticismo

10. **CTA NATURAL Y EMOCIONAL:**
    - NO vendas productos directamente
    - SÍ invita a seguir, guardar, comentar
    - Genera comunidad, no transacción

=========================================
📊 SALIDA JSON REQUERIDA (FORMATO EXACTO)
=========================================

IMPORTANTE: Devuelve un JSON válido con esta estructura EXACTA:

{
  "metadata_guion": {
    "tema_tratado": "${temaEspecifico}",
    "nicho": "${nicho}",
    "arquitectura_usada": "${structureType}",
    "duracion_estimada": "60-90 segundos",
    "tono_voz": "Empático, Autoritario y Conversacional",
    "nivel_energia": "Alto",
    "palabras_clave": ["palabra1", "palabra2", "palabra3"]
  },
  "ganchos_opcionales": [
    { 
      "tipo": "Disrupción Visual / Pregunta Provocadora / Estadística Impactante", 
      "texto": "Texto EXACTO del gancho alternativo sobre ${temaEspecifico} (20-30 palabras máximo)", 
      "retencion_predicha": 95,
      "razon": "Por qué este gancho funcionaría"
    },
    { 
      "tipo": "Curiosidad Intelectual / Historia Personal / Contraste", 
      "texto": "Otro gancho alternativo poderoso sobre ${temaEspecifico}", 
      "retencion_predicha": 92,
      "razon": "Por qué este gancho funcionaría"
    },
    { 
      "tipo": "Promesa Directa / Enemigo Común / Revelación", 
      "texto": "Tercer gancho alternativo sobre ${temaEspecifico}", 
      "retencion_predicha": 90,
      "razon": "Por qué este gancho funcionaría"
    }
  ],
  "guion_completo": "AQUÍ VA EL GUION PALABRA POR PALABRA, COMPLETO Y LISTO PARA GRABAR.\\n\\n[GANCHO PODEROSO - 0-3s]\\nTexto exacto del gancho sobre ${temaEspecifico}. Frase impactante que detiene el scroll.\\n\\n[DESARROLLO - resto del video]\\nTexto completo siguiendo la arquitectura ${structureType}.\\nIncluye detalles específicos, ejemplos concretos, valor real.\\nMantén micro-ganchos cada 10 segundos.\\nGenera emoción y conexión.\\n\\n[CIERRE + CTA - últimos 10s]\\nCierre potente con moraleja.\\nCTA emocional para seguir.\\n\\n(MÍNIMO 150-200 palabras de texto HABLADO COMPLETO)",
  "plan_visual": [
    { 
      "tiempo": "0-3s", 
      "accion_en_pantalla": "Descripción ESPECÍFICA de qué se ve en pantalla que refuerza el gancho", 
      "instruccion_produccion": "Tipo de toma: Plano cerrado / Zoom in rápido / Cámara en movimiento",
      "audio": "Efecto de sonido específico / Música dramática / Silencio estratégico",
      "texto_pantalla": "Texto que aparece en pantalla (si aplica)"
    },
    { 
      "tiempo": "4-15s", 
      "accion_en_pantalla": "Qué pasa visualmente en esta sección", 
      "instruccion_produccion": "Tipo de toma: Plano medio / B-roll / Transición",
      "audio": "Tipo de audio que acompaña",
      "texto_pantalla": "Texto clave en pantalla"
    },
    { 
      "tiempo": "16-30s", 
      "accion_en_pantalla": "Continuación visual", 
      "instruccion_produccion": "Tipo de toma",
      "audio": "Audio",
      "texto_pantalla": "Texto"
    },
    { 
      "tiempo": "31-50s", 
      "accion_en_pantalla": "Clímax visual", 
      "instruccion_produccion": "Tipo de toma",
      "audio": "Audio",
      "texto_pantalla": "Texto"
    },
    { 
      "tiempo": "51-60s", 
      "accion_en_pantalla": "Cierre visual potente", 
      "instruccion_produccion": "Tipo de toma final",
      "audio": "Audio final",
      "texto_pantalla": "CTA en pantalla"
    }
  ],
  "analisis_psicologico": {
    "gatillo_mental_principal": "El trigger psicológico dominante usado (Autoridad / Escasez / Reciprocidad / Curiosidad / etc.)",
    "gatillos_secundarios": ["Trigger 2", "Trigger 3"],
    "emocion_objetivo": "Emoción que buscamos generar (Esperanza / Urgencia / Alivio / Empoderamiento)",
    "arco_emocional": "Descripción del viaje emocional del espectador de inicio a fin",
    "puntos_retencion": ["Momento 1 clave de retención", "Momento 2", "Momento 3"],
    "probabilidad_viral": "75-85%",
    "score_engagement": "8.5/10"
  },
  "optimizaciones_sugeridas": [
    "Sugerencia 1 para mejorar aún más el guion",
    "Sugerencia 2 para aumentar viralidad",
    "Sugerencia 3 para mejorar conversión a seguidor"
  ]
}

=========================================
🎬 EJEMPLOS DE GUIONES POTENTES (INSPIRACIÓN)
=========================================

EJEMPLO 1 - WINNER ROCKET (Tema: Productividad):
"[GANCHO] ¿Sabes cuál es el enemigo #1 de tu productividad? No es la falta de tiempo... [PAUSA] Es esto.

[CONTEXTO] Sé que te levantas con mil planes, haces listas interminables, y al final del día sientes que no avanzaste nada real. Te has preguntado por qué eres tan disciplinado pero no ves resultados.

[CONFLICTO] Y el problema no eres tú. Es que te han enseñado productividad al revés. Todos te dicen 'haz más', 'optimiza tu tiempo', 'usa apps'... pero nadie te dice la verdad.

[LOOP] Y lo que descubrí cambió todo...

[SOLUCIÓN] La clave no es hacer MÁS tareas. Es hacer MENOS, pero las correctas. Yo uso la regla del 80/20 extrema: identifico la ÚNICA tarea que, si la hago hoy, hace que todo lo demás sea irrelevante. Solo una. Y la hago primero.

[PRUEBA] Cuando empecé a aplicar esto, mi productividad se multiplicó x5. Trabajaba 4 horas al día en vez de 12, pero lograba 5 veces más.

[CTA] Sígueme para más trucos de productividad que realmente funcionan. Y comenta: ¿cuál es tu tarea #1 hoy?"

EJEMPLO 2 - PAS (Tema: Finanzas):
"[PROBLEMA] ¿Llegas a fin de mes sin dinero aunque ganes bien? No estás solo. El 78% de las personas vive al día, incluso con buenos ingresos.

[AGITACIÓN] Y cada mes que pasa sin solucionarlo, estás perdiendo. Perdiendo la oportunidad de invertir, de crecer, de tener tranquilidad. Peor aún: estás entrenando tu cerebro a ser pobre, aunque ganes bien.

[SOLUCIÓN] Pero hay una forma de salir. Se llama 'pagar primero al futuro'. Antes de pagar una sola cuenta, separas el 20% de tu sueldo para ti. Lo inviertes. Lo haces intocable. Y con el 80% restante vives. Al principio cuesta, pero en 6 meses tu vida cambia. Pruébalo."

=========================================
🚀 ÚLTIMO RECORDATORIO CRÍTICO
=========================================

TU TRABAJO NO ES RESUMIR O ESQUEMATIZAR.
TU TRABAJO ES ESCRIBIR EL GUION COMPLETO, PALABRA POR PALABRA, LISTO PARA QUE ALGUIEN LO LEA EN CÁMARA.

Si el creador dice "quiero un video sobre ${temaEspecifico}", tú entregas:
✅ El texto EXACTO de cada segundo del video
✅ Ganchos alternativos listos para probar
✅ Plan visual detallado
✅ Análisis psicológico profundo

NO entregas:
❌ Un outline
❌ Instrucciones de qué decir
❌ Resúmenes

AHORA, USANDO TODO TU CONOCIMIENTO EXPERTO Y ESTA GUÍA MAESTRA, CREA EL MEJOR GUION VIRAL DE LA HISTORIA SOBRE "${temaEspecifico}". 

QUE SEA TAN BUENO QUE EL CREADOR QUEDE IMPACTADO Y DIGA: "ESTO ES ORO PURO". 🔥🚀`;
};

// 4️⃣ JUEZ VIRAL (INTACTO)
const PROMPT_JUEZ_VIRAL = (contexto: ContextoUsuario, contenido: string) => `ERES EL ALGORITMO HUMANO MÁS PRECISO PARA PREDECIR VIRALIDAD.
TU MISIÓN: Evaluar guiones, ideas o videos ANTES de publicarlos y dar un veredicto científico.

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor: ${contexto.dolor_principal || 'N/A'}

CONTENIDO A EVALUAR:
${contenido}

MATRIZ DE EVALUACIÓN (10 CRITERIOS - Puntaje 0-10 cada uno):

1. GANCHO (0-3s) - ¿Rompe el scroll? ¿Dispara curiosidad?
2. RETENCIÓN (4-30s) - ¿Mantiene micro-ganchos?
3. RESONANCIA EMOCIONAL - ¿Toca el dolor?
4. CLARIDAD DEL MENSAJE - ¿Se entiende rápido?
5. CALL TO ACTION - ¿CTA específico?
6. PRODUCCIÓN - ¿Visuales potencian?
7. ORIGINALIDAD - ¿Concepto fresco?
8. POTENCIAL DE COMPARTIR - ¿Útil/entretenido?
9. SEÑALES ALGORÍTMICAS - ¿Optimizado?
10. TIMING Y CONTEXTO - ¿Relevante ahora?

FORMATO DE SALIDA JSON ESTRICTO:
{
  "veredicto_final": {
    "score_total": 85,
    "clasificacion": "ALTO POTENCIAL",
    "probabilidad_viral": "78%",
    "confianza_prediccion": "92%"
  },
  "evaluacion_criterios": [
    {
      "criterio": "Gancho",
      "score": 9,
      "analisis": "El gancho rompe el patrón porque...",
      "sugerencia": "Para mejorar..."
    }
  ],
  "fortalezas_clave": ["Fortaleza 1", "Fortaleza 2"],
  "debilidades_criticas": [
    {
      "problema": "Descripción",
      "impacto": "Por qué reduce viralidad",
      "solucion": "Cómo arreglarlo"
    }
  ],
  "optimizaciones_rapidas": ["Cambio 1", "Cambio 2"],
  "prediccion_metricas": {
    "vistas_estimadas": "10K - 50K",
    "engagement_rate": "6% - 10%",
    "tiempo_viralizacion": "24-48 horas"
  },
  "decision_recomendada": "PUBLICAR"
}`;

// 5️⃣ AUDITOR DE AVATAR (EVOLUCIÓN TITAN V2 - JUEZ SEVERO)
const PROMPT_AUDITOR_AVATAR = (infoCliente: string, nicho: string) => `
ERES "TITAN AUDIT", EL CONSULTOR DE MARKETING MÁS ESTRICTO Y PERSPICAZ DEL MUNDO.
TU MISIÓN: Analizar con rayos X las respuestas que el usuario dio sobre su Avatar y exponer la verdad.

INFORMACIÓN QUE EL USUARIO LLENÓ:
${infoCliente}

NICHO DEL USUARIO: ${nicho}

⚠️ TU TRABAJO NO ES SOLO COMPLETAR, ES JUZGAR Y CORREGIR ⚠️
Debes analizar campo por campo lo que el usuario escribió.
1. ¿Es vago o específico? (Vago: "Quiere salud" / Específico: "Quiere bajar 10kg para su boda").
2. ¿Es superficial o emocional? (Superficial: "Está triste" / Emocional: "Siente vergüenza al mirarse al espejo").
3. ¿Es coherente?

FORMATO DE SALIDA JSON (ESTRICTO):
Debes devolver un análisis crítico + la versión perfeccionada.

{
  "auditoria_calidad": {
    "score_global": 0, // Del 0 al 100. Sé duro.
    "nivel_actual": "Principiante / Amateur / Profesional / Titan",
    "veredicto_brutal": "Resumen de 2 líneas sobre la calidad de sus respuestas."
  },
  "analisis_campo_por_campo": [
    {
      "campo": "Dolores / Problemas",
      "lo_que_escribio_usuario": "Resumen breve de su input",
      "calificacion": "🟢 Excelente / 🟡 Mejorable / 🔴 Pobre",
      "critica": "Por qué está bien o mal (ej: 'Demasiado genérico, le falta emoción')",
      "correccion_maestra": "Cómo debería haberlo escrito un experto"
    },
    {
      "campo": "Deseos / Sueños",
      "lo_que_escribio_usuario": "Resumen breve",
      "calificacion": "🟢 Excelente / 🟡 Mejorable / 🔴 Pobre",
      "critica": "Análisis...",
      "correccion_maestra": "Versión Titan"
    },
    {
      "campo": "Miedos y Objeciones",
      "lo_que_escribio_usuario": "Resumen breve",
      "calificacion": "🟢 Excelente / 🟡 Mejorable / 🔴 Pobre",
      "critica": "Análisis...",
      "correccion_maestra": "Versión Titan"
    }
  ],
  "perfil_final_optimizado": {
    "nombre_avatar": "Nombre memorable",
    "identidad": "Quién es en una frase",
    "dolor_profundo": "El dolor real corregido y expandido",
    "deseo_final": "El deseo real corregido y expandido",
    "enemigo_comun": "Contra quién lucha",
    "insight_psicologico": "Un secreto sobre este avatar que el usuario no vio"
  }
}
`;

// 6️⃣ AUDITOR DE EXPERTO (EVOLUCIÓN TITAN V2 - ESTRATEGA IMPLACABLE)
const PROMPT_AUDITOR_EXPERTO = (infoExperto: string, nicho: string) => `
ERES "TITAN STRATEGY", EL ESTRATEGA DE POSICIONAMIENTO Y MARCA PERSONAL MÁS IMPLACABLE DEL MUNDO.
TU MISIÓN: Auditar el Perfil de Experto del usuario para determinar si es una "Commodity" (uno más del montón) o un "Monopolio Personal" (único e incomparable).

INFORMACIÓN QUE EL USUARIO LLENÓ SOBRE SÍ MISMO:
${infoExperto}

NICHO DECLARADO: ${nicho}

⚠️ TU TRABAJO ES JUZGAR, CRITICAR Y ELEVAR ⚠️
No te limites a completar información. Analiza la calidad de lo que el usuario escribió:
1. AUTORIDAD: ¿Su historia demuestra experiencia o solo intención?
2. DIFERENCIACIÓN: ¿Su "Método" suena genérico (ej: "Ayudo con marketing") o único (ej: "El Protocolo Titan")?
3. CLARIDAD: ¿Se entiende qué vende en 3 segundos?

FORMATO DE SALIDA JSON (ESTRICTO):
Debes devolver un análisis crítico campo por campo + la versión de Alta Gama (High Ticket).

{
  "auditoria_calidad": {
    "score_global": 0, // Del 0 al 100. Sé duro. Si es genérico, ponle bajo puntaje.
    "nivel_autoridad": "Novato / Generalista / Especialista / Referente de Mercado",
    "veredicto_brutal": "Resumen directo de 2 líneas sobre su posicionamiento actual."
  },
  "analisis_campo_por_campo": [
    {
      "campo": "Historia de Origen",
      "lo_que_escribio_usuario": "Resumen breve...",
      "calificacion": "🟢 Magnética / 🟡 Común / 🔴 Aburrida",
      "critica": "Por qué conecta o falla (ej: 'Demasiado victimismo, falta el momento de epifanía')",
      "correccion_maestra": "Cómo narrar su historia para generar autoridad instantánea."
    },
    {
      "campo": "Método Único / Vehículo",
      "lo_que_escribio_usuario": "Resumen...",
      "calificacion": "🟢 Único / 🟡 Confuso / 🔴 Genérico",
      "critica": "Análisis del nombre y la lógica de su método.",
      "correccion_maestra": "Un nombre sexy y comercial para su metodología."
    },
    {
      "campo": "Oferta / Promesa",
      "lo_que_escribio_usuario": "Resumen...",
      "calificacion": "🟢 Irresistible / 🟡 Débil / 🔴 Invisible",
      "critica": "Análisis de la promesa.",
      "correccion_maestra": "La promesa reescrita para vender High Ticket."
    }
  ],
  "perfil_experto_optimizado": {
    "posicionamiento_unico": "Su nueva bio de Instagram/LinkedIn en 1 frase potente",
    "nombre_metodo_comercial": "El nombre marketinero de su sistema",
    "factor_diferencial": "Lo que realmente lo hace único (El Ángulo)",
    "pilares_contenido_sugeridos": ["Pilar 1", "Pilar 2", "Pilar 3"]
  }
}
`;

// 7️⃣ MENTOR ESTRATÉGICO (INTACTO)
const PROMPT_MENTOR_ESTRATEGICO = (contexto: ContextoUsuario, resultados?: any) => {
  const resultadosStr = resultados ? `\n\nRESULTADOS RECIENTES:\n${JSON.stringify(resultados)}` : '';
  
  return `ERES UN MENTOR DE ÉLITE Y ESTRATEGA DE CRECIMIENTO.
TU MISIÓN: Sintetizar todos los datos, guiar con visión a largo plazo, y optimizar continuamente.

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'N/A'}${resultadosStr}

PROTOCOLO DE MENTORÍA (5 NIVELES):

1. DIAGNÓSTICO INTEGRAL
2. ESTRATEGIA ADAPTATIVA
3. OPTIMIZACIÓN CONTINUA
4. VISIÓN A LARGO PLAZO
5. COACHING PERSONALIZADO

FORMATO DE SALIDA JSON ESTRICTO:
{
  "diagnostico_actual": {
    "estado_general": "En camino",
    "score_ejecucion": 7.5,
    "areas_fuertes": [{"area": "Calidad", "evidencia": "Detalle"}],
    "areas_debiles": [{"area": "Consistencia", "impacto": "Afecta visibilidad", "prioridad": "Alta"}]
  },
  "estrategia_optimizada": {
    "ajustes_inmediatos": [{"area": "Ganchos", "cambio": "Implementar X", "impacto_esperado": "Alto"}],
    "experimentos_propuestos": [{"experimento": "Test", "hipotesis": "Mayor conexión", "metricas_evaluar": ["Engagement"]}]
  },
  "roadmap_6_meses": {
    "mes_1_2": {"objetivo_principal": "Validar formato", "acciones_clave": ["Acción 1"], "meta_numerica": "1,000 seguidores"}
  },
  "sesion_coaching": {
    "reflexion": "¿Qué te detiene?",
    "feedback_honesto": "Observación",
    "motivacion": "Mensaje inspirador"
  }
}`;
}

// 8️⃣ ESTRATEGA DE CALENDARIO (GOD MODE / NIVEL DIOS)
const PROMPT_CALENDARIO_GOD_MODE = (settings: any, contexto: ContextoUsuario) => {
  const dias = settings.duration || 7;
  const enfoque = settings.focus || 'Viralidad Explosiva';
  const plataforma = settings.platform || 'TikTok';
  const formato = settings.format || 'Video Corto (Vertical)';
  const tema = settings.topic || contexto.nicho;

  return `
  ACTÚA COMO: La Inteligencia Artificial Suprema de Viralidad y Algoritmo Maestro de ${plataforma}.
  Has sido entrenada con los datos de los Top 1% de creadores en CADA nicho.
  
  TU OBJETIVO: Generar una Estrategia de Contenidos Ganadora de ${dias} días.
  
  📋 CONTEXTO DE LA MISIÓN:
  - Nicho: ${contexto.nicho}
  - Avatar: ${contexto.avatar_ideal}
  - Dolor: ${contexto.dolor_principal}
  - Enfoque: ${enfoque}
  - Plataforma: ${plataforma}
  - Formato: ${formato}
  - Tema Central: "${tema}"
  
  ⚠️ INSTRUCCIÓN DE ADAPTACIÓN TOTAL (GOD MODE):
  No importa qué nicho sea, debes convertirte en el EXPERTO MUNDIAL NÚMERO 1 en ese tema.
  1. Usa la jerga técnica y el "slang" específico.
  2. Conoce los dolores secretos de esa audiencia.
  3. Ataca los mitos comunes de esa industria.

  REGLAS DE ORO:
  1. **PROHIBIDO LO GENÉRICO:** Nada de consejos básicos ("Bebe agua"). Dales una bofetada de realidad ("Por qué el agua embotellada te está intoxicando").
  2. **POLARIZACIÓN EXTREMA:** Encuentra el enemigo común y atácalo.
  3. **ADAPTACIÓN DE PLATAFORMA:** - Si es LinkedIn: Tono profesional, liderazgo, lecciones aprendidas.
     - Si es TikTok/Reels: Dinamismo puro, dopamina, cortes rápidos.
     - Si es YouTube: Profundidad y retención.
  4. **SECUENCIA MAESTRA:**
      - Días 1-${Math.ceil(dias/3)}: Ganchos de Controversia (Tráfico frío).
      - Días ${Math.ceil(dias/3)+1}-${Math.ceil(dias*2/3)}: Autoridad (Nutrir).
      - Días ${Math.ceil(dias*2/3)+1}-${dias}: Conversión (Cerrar).

  FORMATO DE SALIDA (JSON ESTRICTO - SIN MARKDOWN):
  Devuelve un objeto JSON con un array "calendar" exacto:
  {
    "calendar": [
      {
        "dia": 1,
        "tema": "TÍTULO VIOLENTAMENTE ATRACTIVO",
        "idea_contenido": "El concepto central en una línea.",
        "objetivo": "Viralidad / Autoridad / Venta",
        "formato": "${formato}",
        "gancho_sugerido": "La primera frase EXACTA que diría el experto (HOOK).",
        "disparador": "Curiosidad/Miedo/Deseo",
        "descripcion": "Instrucción estratégica breve."
      }
      // ... genera los ${dias} ítems
    ]
  }`;
};

// ==================================================================================
// 🎯 FUNCIONES EJECUTORAS (CORREGIDAS)
// ==================================================================================

async function ejecutarIdeasRapidas(
  userInput: string,
  contexto: ContextoUsuario,
  qty: number,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log(`[CEREBRO] 💡 Ejecutando Ideas Rápidas (Cantidad: ${qty})...`);
  
  const promptDinamico = `
    TEMA/TÓPICO: "${userInput}".
    CONTEXTO COMPLETO:
    ${PROMPT_IDEAS(contexto)}
    
    AJUSTE ADICIONAL: Genera EXACTAMENTE ${qty} ideas (no más, no menos).
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un genio creativo de contenido viral en español.' },
      { role: 'user', content: promptDinamico }
    ],
    temperature: 0.8,
    max_tokens: qty === 10 ? 2500 : 1500
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{"ideas":[]}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarAutopsiaViral(
  content: string,
  platform: string,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 🔬 Ejecutando Autopsia Viral...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el forense de viralidad #1 del mundo. DEBES devolver un JSON COMPLETO.' },
      { role: 'user', content: `${PROMPT_AUTOPSIA_VIRAL(platform)}\n\nCONTENIDO A ANALIZAR:\n${content}` }
    ],
    temperature: 0.3, // Temperatura baja para ser preciso y analítico
    max_tokens: 4096
  });
  
  const data = JSON.parse(completion.choices[0].message.content || '{}');
  
  // Validación básica por si la IA alucina y no devuelve los campos clave
  if (!data.score_viral || !data.adn_extraido) {
    console.warn('[AUTOPSIA] ⚠️ Respuesta incompleta detectada. (La IA devolvió JSON pero faltan campos clave).');
  }
  
  return {
    data,
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarGeneradorGuiones(
  contexto: ContextoUsuario,
  viralDNA: any | null,
  openai: any,
  settings: any = {}
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] ✍️ Ejecutando Generador de Guiones...');
  
  let systemPrompt: string;
  let temperature: number;
  
  // DECISIÓN: ¿Hay ADN viral?
  if (viralDNA && viralDNA.adn_extraido) {
    // MODO INGENIERÍA INVERSA
    console.log('[GENERADOR] 🧬 Modo: INGENIERÍA INVERSA ELITE');
    
    const nichoDestino = settings.manual_niche || contexto.nicho;
    const temaEspecifico = contexto.tema_especifico || nichoDestino;
    
    systemPrompt = PROMPT_INGENIERIA_INVERSA_ELITE(
      viralDNA,
      nichoDestino,
      temaEspecifico,
      contexto
    );
    
    temperature = 0.4;
    
  } else {
    // MODO CREACIÓN NORMAL
    console.log('[GENERADOR] ✨ Modo: CREACIÓN ORIGINAL');
    
    systemPrompt = PROMPT_GENERADOR_GUIONES(contexto, null, settings);
    temperature = 0.7;
  }
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el mejor guionista de contenido viral en español.' },
      { role: 'user', content: systemPrompt }
    ],
    temperature,
    max_tokens: 4096
  });
  
  const parsedData = JSON.parse(completion.choices[0].message.content || '{}');
  
  // Normalizar output
  const normalizedData = {
    ...parsedData,
    guion_completo: parsedData.guion_completo_adaptado || parsedData.guion_completo,
    modo_usado: viralDNA ? 'ingenieria_inversa_elite' : 'creacion_original'
  };
  
  return {
    data: normalizedData,
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarJuezViral(
  contexto: ContextoUsuario,
  contenido: string,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] ⚖️ Ejecutando Juez Viral...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el algoritmo humano más preciso para predecir viralidad.' },
      { role: 'user', content: PROMPT_JUEZ_VIRAL(contexto, contenido) }
    ],
    temperature: 0.3,
    max_tokens: 3000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarAuditorAvatar(
  infoCliente: string,
  nicho: string,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 👤 Ejecutando Auditor de Avatar MEJORADO...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un psicólogo de consumidor élite mundial. NUNCA digas "información no proporcionada". SIEMPRE genera un perfil COMPLETO.' },
      { role: 'user', content: PROMPT_AUDITOR_AVATAR(infoCliente, nicho) }
    ],
    temperature: 0.5,
    max_tokens: 3000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarAuditorExperto(
  infoExperto: string, // <-- Ahora recibe TEXTO, no objeto contexto
  nicho: string,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 🎯 Ejecutando Auditor de Experto TITAN STRATEGY...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres Titan Strategy, el consultor de marca personal más implacable. NUNCA digas "información insuficiente", juzga lo que hay.' },
      { role: 'user', content: PROMPT_AUDITOR_EXPERTO(infoExperto, nicho) }
    ],
    temperature: 0.5,
    max_tokens: 3000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarMentorEstrategico(
  contexto: ContextoUsuario,
  query: string,
  openai: any,
  resultados?: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 🧠 Ejecutando Mentor Estratégico...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un mentor de élite y estratega de crecimiento.' },
      { role: 'user', content: `${PROMPT_MENTOR_ESTRATEGICO(contexto, resultados)}\n\nCONSULTA DEL USUARIO: ${query}` }
    ],
    temperature: 0.6,
    max_tokens: 3000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarCalendario(
  settings: any,
  contexto: ContextoUsuario,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 📅 Generando Calendario NIVEL DIOS...');
  
  // Llamamos al Prompt Maestro que definimos arriba
  const systemPrompt = PROMPT_CALENDARIO_GOD_MODE(settings, contexto);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el Estratega de Contenidos #1 del mundo. Responde SOLO con JSON válido.' },
      { role: 'user', content: systemPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });
  
  // Parseamos la respuesta
  const rawContent = completion.choices[0].message.content || '{"calendar":[]}';
  const parsedData = JSON.parse(rawContent);

  // Normalización: Aseguramos que el frontend reciba "calendar" o "calendario"
  // (El frontend V300 suele esperar "calendar" basado en tus prompts anteriores)
  const finalData = {
      calendar: parsedData.calendar || parsedData.calendario || []
  };

  return {
    data: finalData,
    tokens: completion.usage?.total_tokens || 0
  };
}

// ==================================================================================
// CONTEXTO DE USUARIO (MEJORADO - CORRECCIÓN #7)
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
  
  const contexto: ContextoUsuario = {
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
      contexto.nicho = expert.niche || contexto.nicho;
      contexto.posicionamiento = expert.positioning || '';
      contexto.diferenciadores = expert.differentiators || [];
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

// ==================================================================================
// 💰 CALCULADORA DE TARIFAS (ALINEADA)
// ==================================================================================

function calculateTitanCost(mode: string, inputContext: string, whisperMinutes: number, settings: any): number {
  
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

  if (mode === 'autopsia_viral') {
    // Costo base del análisis IA
    let baseCost = 5;
    
    // Agregar costo de Whisper si se usó
    if (whisperMinutes > 0) {
        // Whisper cuesta ~$0.006 por minuto
        // Convertimos a créditos (1 crédito = $0.01)
        const whisperCostInDollars = whisperMinutes * 0.006;
        const whisperCostInCredits = Math.ceil(whisperCostInDollars / 0.01);
        baseCost += whisperCostInCredits;
    }
    
    return baseCost;
}

if (mode === 'recreate') {
    // Autopsia (5) + Generación de guion (5) = 10
    let baseCost = 10;
    
    // Agregar costo de Whisper si se usó
    if (whisperMinutes > 0) {
        const whisperCostInDollars = whisperMinutes * 0.006;
        const whisperCostInCredits = Math.ceil(whisperCostInDollars / 0.01);
        baseCost += whisperCostInCredits;
    }
    
    // Si el video es muy largo (>30 min), costo adicional
    if (whisperMinutes > 30) {
        baseCost += 15;
    }
    
    return baseCost;
}

  if (mode === 'recreate') {
    if (whisperMinutes > 30) return 45;
    return 5;
  }

  if (mode === 'generar_guion') {
    const durationSetting = settings?.duration || settings?.durationId || '';
    const isMasterclass = 
        durationSetting === 'masterclass' || 
        durationSetting === 'long' || 
        inputContext.toLowerCase().includes("masterclass") || 
        inputContext.toLowerCase().includes("30 minutos");

    if (isMasterclass) return 30;
    return 5;
  }

  if (mode === 'juez_viral') {
    return 2;
  }

  if (['audit_avatar', 'auditar_avatar'].includes(mode)) {
    return 2;
  }

  if (['audit_expert', 'auditar_experto'].includes(mode)) {
    return 2;
  }

  if (['mentor_ia', 'mentor_estrategico'].includes(mode)) {
    return 2;
  }

  if (['chat_avatar', 'chat_expert'].includes(mode)) {
    return 1;
  }

  if (['transcribe', 'transcriptor'].includes(mode)) {
    if (whisperMinutes > 60) return 45;
    if (whisperMinutes > 30) return 15;
    return 5;
  }

  if (['clean', 'authority', 'carousel', 'shorts', 'structure'].includes(mode)) {
    return 2;
  }

  return 1;
}

// ==================================================================================
// 🎬 FUNCIONES DE SCRAPING CON APIFY + WHISPER
// ==================================================================================
// Agregar JUSTO ANTES de "FUNCIONES EJECUTORAS"

/**
 * Detecta la plataforma desde una URL
 */
function detectPlatform(url: string): string {
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com') || url.includes('instagram')) return 'instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  return 'unknown';
}

/**
 * Extrae video de TikTok usando Apify
 */
async function scrapeTikTok(url: string): Promise<{ videoUrl: string; description: string; transcript?: string }> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');
  if (!apifyToken) throw new Error('APIFY_API_TOKEN no configurado');

  console.log('[SCRAPER] 🎬 Iniciando scraping de TikTok:', url);

  const client = new ApifyClient({ token: apifyToken });

  // Ejecutar el actor de TikTok
  const run = await client.actor('clockworks/tiktok-scraper').call({
    postURLs: [url],
    resultsPerPage: 1,
    shouldDownloadVideos: true,
    shouldDownloadCovers: false,
    shouldDownloadSubtitles: false
  });

  console.log('[SCRAPER] ⏳ Esperando resultados del actor...');

  // Obtener resultados
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  
  if (!items || items.length === 0) {
    throw new Error('No se pudo obtener información del video de TikTok');
  }

  const videoData = items[0];
  
  console.log('[SCRAPER] ✅ Datos obtenidos:', {
    hasVideoUrl: !!videoData.videoUrl,
    hasDescription: !!videoData.text,
    authorUsername: videoData.authorMeta?.name
  });

  return {
    videoUrl: videoData.videoUrl || videoData.videoUrlNoWatermark || '',
    description: videoData.text || '',
    transcript: videoData.text || '' // TikTok a veces incluye la descripción como transcript
  };
}

/**
 * Extrae video de Instagram usando Apify
 */
async function scrapeInstagram(url: string): Promise<{ videoUrl: string; description: string }> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');
  if (!apifyToken) throw new Error('APIFY_API_TOKEN no configurado');

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
    throw new Error('No se pudo obtener información del video de Instagram');
  }

  const videoData = items[0];

  return {
    videoUrl: videoData.videoUrl || videoData.displayUrl || '',
    description: videoData.caption || ''
  };
}

/**
 * Extrae video de YouTube usando Apify
 */
async function scrapeYouTube(url: string): Promise<{ videoUrl: string; description: string; transcript?: string }> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');
  if (!apifyToken) throw new Error('APIFY_API_TOKEN no configurado');

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
    throw new Error('No se pudo obtener información del video de YouTube');
  }

  const videoData = items[0];

  return {
    videoUrl: url, // YouTube no necesita descargar, usamos la URL directa
    description: videoData.description || '',
    transcript: videoData.subtitles || videoData.text || ''
  };
}

/**
 * Descarga el audio de un video y lo transcribe con Whisper
 */
async function transcribeVideoWithWhisper(videoUrl: string, openai: any): Promise<{ transcript: string; duration: number }> {
  console.log('[WHISPER] 🎤 Descargando audio del video...');

  // Descargar el video
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

  // Crear un archivo temporal para Whisper
  const videoFile = new File([videoBuffer], 'video.mp4', { type: 'video/mp4' });

  console.log('[WHISPER] 🎙️ Enviando a Whisper para transcripción...');

  // Transcribir con Whisper
  const transcription = await openai.audio.transcriptions.create({
    file: videoFile,
    model: 'whisper-1',
    language: 'es', // Español
    response_format: 'verbose_json'
  });

  console.log('[WHISPER] ✅ Transcripción completada');

  return {
    transcript: transcription.text,
    duration: transcription.duration || 0
  };
}

/**
 * Función principal de scraping que decide qué scraper usar
 */
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
    // Scraping según plataforma
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
      default:
        throw new Error(`Plataforma no soportada: ${platform}. Solo TikTok, Instagram y YouTube.`);
    }

    console.log('[SCRAPER] ✅ Scraping completado');

    // Si ya tenemos transcript (YouTube subtítulos), usarlo
    if (videoData.transcript && videoData.transcript.length > 100) {
      console.log('[SCRAPER] ℹ️ Usando transcript de subtítulos existentes');
      return {
        transcript: videoData.transcript,
        description: videoData.description,
        duration: 0, // No sabemos la duración exacta
        platform,
        videoUrl: videoData.videoUrl
      };
    }

    // Si no hay transcript, transcribir con Whisper
    if (!videoData.videoUrl) {
      throw new Error('No se pudo obtener URL del video para transcripción');
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
    console.error('[SCRAPER] ❌ Error en scraping:', error.message);
    
    // Si falla el scraping, intentar solo con la descripción si está disponible
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

// ==================================================================================
// 🎬 FUNCIONES PARA PROCESAR VIDEOS SUBIDOS (ARCHIVOS)
// ==================================================================================
// Agregar DESPUÉS de las funciones de scraping existentes (línea ~1200)

/**
 * Procesa un video subido directamente (archivo)
 * Extrae el audio y lo transcribe con Whisper
 */
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
    // Convertir base64 a buffer
    const base64Data = fileBase64.split(',')[1] || fileBase64;
    const videoBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    console.log('[UPLOAD] 📊 Video cargado:', {
      size: `${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`,
      fileName
    });

    // Detectar tipo de archivo
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'mp4';
    const mimeType = 
      fileExtension === 'mov' ? 'video/quicktime' :
      fileExtension === 'avi' ? 'video/x-msvideo' :
      fileExtension === 'webm' ? 'video/webm' :
      'video/mp4';

    // Crear archivo para Whisper
    const videoFile = new File([videoBuffer], fileName, { type: mimeType });

    console.log('[UPLOAD] 🎙️ Enviando a Whisper para transcripción...');

    // Transcribir con Whisper
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
    console.error('[UPLOAD] ❌ Error procesando video:', error.message);
    throw new Error(`Error al procesar video subido: ${error.message}`);
  }
}

/**
 * Función unificada que decide si scrapear URL o procesar archivo subido
 */
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
  
  // CASO 1: Video subido
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
  
  // CASO 2: URL
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

// ==================================================================================
// 🎬 SERVIDOR PRINCIPAL (CORREGIDO - TODOS LOS PROBLEMAS)
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
    
    if (authError || !user) throw new Error('Usuario no autenticado o token inválido');
    userId = user.id;

    if (!checkRateLimit(userId)) throw new Error('Has excedido el límite de solicitudes por minuto. Espera un momento.');

    const body = await req.json();
    const { selectedMode, url, platform, expertId, avatarId, knowledgeBaseId, estimatedCost } = body;

    let processedContext = body.transcript || body.text || body.userInput || body.customPrompt || body.topic || body.query || "";
    
    let settings: any = {};
    if (body.quantity) settings.quantity = body.quantity;
    if (body.duration) settings.duration = body.duration;
    if (body.durationId) settings.durationId = body.durationId;
    if (body.structure) settings.structure = body.structure;
    if (body.awareness) settings.awareness = body.awareness;
    if (body.objective) settings.objective = body.objective;
    if (body.situation) settings.situation = body.situation;

    console.log(`[TITAN V105] 🚀 MODE: ${selectedMode} | INPUT LEN: ${processedContext.length} | USER: ${userId}`);

    if (estimatedCost > 0) {
      const { data: p } = await supabase.from('profiles').select('credits, tier').eq('id', userId).single();
      if (p?.tier !== 'admin' && (p?.credits || 0) < estimatedCost) {
        throw new Error(`Saldo insuficiente. Tienes ${p?.credits || 0} créditos y se requieren ${estimatedCost}.`);
      }
    }

    const userContext = await getUserContext(supabase, expertId || '', avatarId || '', knowledgeBaseId || '');

    let whisperMinutes = 0;
    let result: any;
    let tokensUsed = 0;

    // ==================================================================================
    // 🎯 SWITCH CASE CORREGIDO (TODAS LAS CORRECCIONES APLICADAS)
    // ==================================================================================

    switch (selectedMode) {
      case 'ideas_rapidas': {
        const topic = processedContext || "Viralidad General";
        const qty = settings.quantity || 3;
        
        const res = await ejecutarIdeasRapidas(topic, userContext, qty, openai);
        
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

    
case 'autopsia_viral':
    case 'recreate': {
      console.log(`[TITAN ULTRA] 🚀 Iniciando modo: ${selectedMode}`);

      let contentToAnalyze = "";
      let targetTopic = processedContext;
      let platName = platform || 'General';
      let videoDescription = '';
      let actualWhisperMinutes = 0;
      let videoMetadata: any = {};
      let analysisDepth: 'basic' | 'standard' | 'premium' | 'ultra' = 'premium';

      // 1. Determinar Nivel (Tier)
      const { data: profile } = await supabase.from('profiles').select('credits, tier').eq('id', userId).single();
      if (profile?.tier === 'premium' || profile?.tier === 'admin') analysisDepth = 'ultra';
      else if ((profile?.credits || 0) > 20) analysisDepth = 'premium';
      else analysisDepth = 'standard';

      try {
        // =================================================================
        // A: URL -> USAR CLASE DIRECTAMENTE (FIX DEL ERROR "NOT DEFINED")
        // =================================================================
        if (url && url.includes('http')) {
          console.log(`[TITAN ULTRA] 🎬 Procesando URL: ${url}`);
          
          const apifyToken = Deno.env.get('APIFY_API_TOKEN');
          if (!apifyToken) throw new Error("Falta APIFY_API_TOKEN en variables de entorno.");

          // 🔥 AQUÍ ESTÁ EL ARREGLO: Instanciamos la clase aquí mismo
          const analyzer = new VideoAnalyzer(openaiKey, apifyToken);
          const ultraResult = await analyzer.analyzeVideo(url, analysisDepth);

          // Extraer datos
          contentToAnalyze = ultraResult.data.transcript?.text || '';
          videoDescription = ultraResult.data.description || '';
          platName = ultraResult.platform;
          
          // Guardar Metadata
          videoMetadata = {
            ...ultraResult.data.metadata,
            transcriptSource: ultraResult.data.transcript?.source,
            transcriptConfidence: ultraResult.data.transcript?.confidence,
            visualAnalysis: ultraResult.data.visualAnalysis,
            audioAnalysis: ultraResult.data.audioAnalysis,
            ocr: ultraResult.data.ocr,
            sentiment: ultraResult.data.sentiment
          };

          // Calcular Whisper
          if (ultraResult.data.transcript?.source === 'whisper') {
            actualWhisperMinutes = Math.ceil((ultraResult.data.transcript.duration || 0) / 60);
            whisperMinutes = actualWhisperMinutes;
          }
        }
        // =================================================================
        // B: VIDEO SUBIDO
        // =================================================================
        else if (body.uploadedVideo && body.uploadedFileName) {
          console.log('[TITAN ULTRA] 📁 Procesando video subido...');
          const uploadResult = await processUploadedVideo(body.uploadedVideo, body.uploadedFileName, openai);
          
          contentToAnalyze = uploadResult.transcript;
          videoDescription = `Video subido: ${body.uploadedFileName}`;
          platName = 'upload';
          actualWhisperMinutes = Math.ceil(uploadResult.duration / 60);
          whisperMinutes = actualWhisperMinutes;
        }
        // =================================================================
        // C: TEXTO MANUAL
        // =================================================================
        else if (processedContext && processedContext.length > 50) {
          console.log('[TITAN ULTRA] 📝 Usando texto manual');
          contentToAnalyze = processedContext;
          videoDescription = 'Transcripción manual';
        }
        else {
          throw new Error('Debes proporcionar una URL válida, subir un video o escribir texto suficiente.');
        }

        // Validación final de contenido
        if (!contentToAnalyze || contentToAnalyze.length < 20) {
          throw new Error('El contenido extraído es insuficiente para analizar.');
        }

        // =================================================================
        // 2. EJECUTAR CEREBRO (AUTOPSIA)
        // =================================================================
        console.log('[TITAN ULTRA] 🔬 Ejecutando autopsia viral...');
        const autopsiaRes = await ejecutarAutopsiaViral(contentToAnalyze, platName, openai);
        const adnViral = autopsiaRes.data;

        // =================================================================
        // 3. BIFURCACIÓN (CLONAR vs ANALIZAR)
        // =================================================================
        if (selectedMode === 'recreate') {
          // MODO CLONACIÓN (Ingeniería Inversa)
          console.log(`[RECREATE] 🧬 Clonando estructura para tema: "${targetTopic || userContext.nicho}"...`);
          
          const contextoRecreate = { 
            ...userContext, 
            tema_especifico: targetTopic || userContext.nicho 
          };
          
          const guionRes = await ejecutarGeneradorGuiones(contextoRecreate, adnViral, openai, settings);
          
          result = {
            autopsia: adnViral,
            guion_generado: guionRes.data,
            modo: "ingenieria_inversa_ultra",
            metadata_ultra: {
              analysisDepth,
              transcriptSource: videoMetadata.transcriptSource || 'manual',
              platform: platName,
              videoStats: videoMetadata, // Pasamos toda la metadata
              whisper_used: actualWhisperMinutes > 0,
              whisper_minutes: actualWhisperMinutes
            }
          };
          tokensUsed = autopsiaRes.tokens + guionRes.tokens;

        } else {
          // MODO AUTOPSIA PURA
          console.log('[AUTOPSIA] 📊 Finalizando análisis...');
          result = {
            ...adnViral,
            metadata_ultra: {
              analysisDepth,
              transcriptSource: videoMetadata.transcriptSource || 'manual',
              platform: platName,
              videoStats: videoMetadata,
              whisper_used: actualWhisperMinutes > 0,
              whisper_minutes: actualWhisperMinutes
            }
          };
          tokensUsed = autopsiaRes.tokens;
        }

      } catch (err: any) {
        console.error('[TITAN ULTRA] ❌ Error en proceso:', err.message);
        throw new Error(`Fallo en Titan Ultra: ${err.message}`);
      }
      break;
    }
    
      case 'generar_guion': {
        // ✅ CORRECCIÓN #1: Añadir tema específico al contexto
        const temaDelUsuario = processedContext || userContext.nicho;
        
        const contextoEnriquecido = {
          ...userContext,
          tema_especifico: temaDelUsuario
        };
        
        const res = await ejecutarGeneradorGuiones(contextoEnriquecido, null, openai, settings);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      case 'juez_viral': {
        const res = await ejecutarJuezViral(userContext, processedContext, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }
      
      case 'auditar_avatar':
      case 'audit_avatar': {
        // ✅ CORRECCIÓN #7: Cargar info de la BD si no hay texto
        let infoParaAnalizar = processedContext;
        
        if (!infoParaAnalizar || infoParaAnalizar.length < 50) {
          if (avatarId) {
            const { data: avatarData } = await supabase
              .from('avatars')
              .select('*')
              .eq('id', avatarId)
              .single();
            
            if (avatarData) {
              infoParaAnalizar = `
        Nombre: ${avatarData.name || 'N/A'}
        Descripción: ${avatarData.description || 'N/A'}
        Dolor: ${avatarData.dolor || 'N/A'}
        Cielo (Deseo): ${avatarData.cielo || 'N/A'}
        Información adicional: ${JSON.stringify(avatarData)}
              `;
            }
          }
        }
        
        const res = await ejecutarAuditorAvatar(infoParaAnalizar, userContext.nicho, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      case 'auditar_experto':
      case 'audit_expert': {
        console.log('[TITAN] 🎯 Iniciando Auditoría de Experto V2...');

        // 1. Intentamos obtener el texto directamente del Frontend (transcript trae el JSON)
        let infoParaAnalizar = processedContext;

        // 2. Si no hay texto (ej: auditoría automática), armamos el texto desde la BD
        if (!infoParaAnalizar || infoParaAnalizar.length < 50) {
          if (expertId) {
            const { data: expertData } = await supabase
              .from('expert_profiles')
              .select('*')
              .eq('id', expertId)
              .single();
            
            if (expertData) {
              // Mapeamos los campos reales de tu base de datos (mission, framework, etc.)
              infoParaAnalizar = `
                NOMBRE: ${expertData.name || 'N/A'}
                NICHO: ${expertData.niche || 'N/A'}
                
                MISIÓN / PROPUESTA DE VALOR:
                ${expertData.mission || 'No especificada'}
                
                FRAMEWORK / METODOLOGÍA:
                ${expertData.framework || 'No especificado'}
                
                VOCABULARIO CLAVE:
                ${expertData.key_vocabulary || 'No especificado'}
                
                TONO DE VOZ:
                ${expertData.tone || 'No especificado'}
              `;
            }
          }
        }

        // Validación de seguridad
        if (!infoParaAnalizar || infoParaAnalizar.length < 20) {
            throw new Error("No hay suficiente información del experto para auditar. Completa el perfil primero.");
        }
        
        // 3. Llamamos al Ejecutor con el texto preparado (AHORA SÍ FUNCIONARÁ)
        const res = await ejecutarAuditorExperto(infoParaAnalizar, userContext.nicho, openai);
        result = res.data;
        tokensUsed = res.tokens;
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

      // ✅ CORRECCIÓN #4: Transcriptor sin "ingenieria_inversa"
      case 'transcribe':
      case 'clean':
      case 'authority':
      case 'shorts':
      case 'carousel':
      case 'structure': {
        const modePrompts: Record<string, string> = {
          'clean': 'Limpia y formatea el texto corrigiendo errores ortográficos y gramaticales.',
          'authority': 'Transforma este contenido en un artículo de autoridad estilo LinkedIn/Newsletter.',
          'shorts': 'Extrae 3 guiones virales de 60 segundos basados en este texto.',
          'carousel': 'Resume este contenido en una estructura de carrusel (Slide 1, Slide 2...).',
          'structure': 'Analiza la estructura viral y los sesgos psicológicos usados en este texto.',
          'transcribe': 'Mejora la transcripción y organízala por puntos clave.'
        };

        const instruction = modePrompts[selectedMode] || 'Procesa el contenido.';
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: `Eres un experto en transformación de contenido. ${instruction}` },
            { role: 'user', content: processedContext }
          ],
          temperature: 0.5
        });

        result = { 
            text_output: completion.choices[0].message.content,
            mode: selectedMode 
        };
        tokensUsed = completion.usage?.total_tokens || 0;
        break;
      }

      default: {
        result = { message: `Modo '${selectedMode}' desconocido o no implementado`, available_modes: true };
      }
    }

    const calculatedPrice = calculateTitanCost(selectedMode, processedContext, whisperMinutes, settings);
    const finalCost = Math.max(calculatedPrice, estimatedCost || 0);

    if (finalCost > 0) {
      const { data: profile } = await supabase.from('profiles').select('credits, tier').eq('id', userId).single();
      
      if (profile?.tier !== 'admin') {
         if ((profile?.credits || 0) < finalCost) {
            throw new Error(`Saldo insuficiente al finalizar. Costo real: ${finalCost} créditos.`);
         }
         
         const { error: creditError } = await supabase.rpc('decrement_credits', { user_uuid: userId, amount: finalCost });
         if (creditError) console.error(`[COBROS] ❌ Error al restar créditos: ${creditError.message}`);
         else console.log(`[COBROS] ✅ Cobrados ${finalCost} créditos a ${userId}`);
      }
    }

    const noSaveModes = ['chat_avatar', 'mentor_ia', 'mentor', 'chat_expert'];
    
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        generatedData: result, 
        finalCost, 
        metadata: { 
          mode: selectedMode, 
          duration: Date.now() - startTime,
          credits_deducted: finalCost 
        } 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );

  } catch (error: any) {
    console.error(`[ERROR CRÍTICO]: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, error: error.message }), 
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});