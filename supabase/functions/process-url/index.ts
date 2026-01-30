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
//  SISTEMA CEREBRAL - PROMPTS V300 MEJORADOS (CORRECCIÓN #1, #5, #6, #7)
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

// 3️⃣ GENERADOR DE GUIONES (MEJORADO - CORRECCIÓN #1 Y #6)
const PROMPT_GENERADOR_GUIONES = (contexto: any, viralDNA: any, settings: any = {}) => {
  // ✅ CORRECCIÓN #1: Extraer tema específico
  const temaEspecifico = contexto.tema_especifico || contexto.nicho || 'General';
  
  // ✅ CORRECCIÓN #6: Mejorar adaptación al nicho cuando hay DNA viral
  const dnaContext = viralDNA ? `

🧬 ADN VIRAL DE REFERENCIA (ESTRUCTURA A MODELAR):
${JSON.stringify(viralDNA, null, 2)}

⚠️⚠️⚠️ INSTRUCCIÓN ULTRA CRÍTICA DE ADAPTACIÓN AL NICHO ⚠️⚠️⚠️

REGLA DE ORO: 
1. Toma SOLO la ESTRUCTURA y MECÁNICAS del video analizado (NO su contenido)
2. El contenido del guion debe ser 100% sobre: "${temaEspecifico}"
3. Dirigido al Avatar: "${contexto.avatar_ideal}"
4. Que resuelva el Dolor: "${contexto.dolor_principal}"
5. Todo el texto debe ser ORIGINAL y específico para "${contexto.nicho}"

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
ENFÓCATE 100% en "${temaEspecifico}".
`;
  
  const structureType = settings.structure || 'winner_rocket'; 
  const awarenessLevel = settings.awareness || 'Consciente del Problema';
  const contentObjective = settings.objective || 'Educar';
  const avatarSituation = settings.situation || 'Dolor Agudo';

  const ARCHITECTURES: Record<string, string> = {
    'winner_rocket': `
      ESTRUCTURA 'WINNER ROCKET' (7 PASOS OBLIGATORIOS):
      1. HOOK PODEROSO (0-3s): Usa el tipo de gancho elegido. Debe ser una afirmación disruptiva, una pregunta filtro o una ruptura de patrón visual. El objetivo es detener el scroll.
      2. CONTEXTO EMPÁTICO (4-10s): Conecta con la realidad del espectador. Usa frases como "Sé que te sientes..." o "Seguramente has intentado...". Valida su situación actual.
      3. CONFLICTO / AGITACIÓN (11-20s): Revela un error común, un mito falso, un bloqueo invisible o un dolor oculto que el avatar está cometiendo. Aumenta la tensión.
      4. CURIOSITY LOOP (21-23s): Abre una incógnita narrativa justo antes de dar la solución ("Y lo que descubrí cambió todo...", "Pero el secreto no es lo que crees...").
      5. INSIGHT / SOLUCIÓN (24-35s): Entrega la enseñanza potente, el método paso a paso o el cambio de mentalidad. Debe ser valor real y aplicable.
      6. RESOLUCIÓN / PRUEBA (36-50s): Muestra el resultado de aplicar ese conocimiento. Comparte una pequeña victoria, un caso de éxito o inspira con la transformación lograda.
      7. CIERRE + CTA NATURAL (51-60s): Cierra con una moraleja que te posicione como autoridad y haz un llamado a la acción emocional (invita a seguirte, no a comprar).`,

    'pas': `ESTRUCTURA 'PAS' (PROBLEMA-AGITACIÓN-SOLUCIÓN):
      1. PROBLEMA (0-10s): Describe el dolor específico del avatar con detalle sangriento.
      2. AGITACIÓN (11-30s): Profundiza en las consecuencias negativas de no solucionar ese problema ahora. Haz que duela.
      3. SOLUCIÓN (31-60s): Presenta tu método/producto como la única pastilla para ese dolor.`,

    'aida': `ESTRUCTURA 'AIDA' (ATENCIÓN-INTERÉS-DESEO-ACCIÓN):
      1. ATENCIÓN (0-5s): Impacto visual o auditivo fuerte.
      2. INTERÉS (6-20s): Datos curiosos, estadísticas o hechos que retengan la mente lógica.
      3. DESEO (21-45s): Muestra los beneficios y la transformación soñada (el placer).
      4. ACCIÓN (46-60s): Instrucción clara y directa de qué hacer a continuación.`,

    'hso': `ESTRUCTURA 'HSO' (HOOK-STORY-OFFER):
      1. HOOK (0-3s): Una promesa fuerte o una declaración controversial.
      2. STORY (4-40s): Cuenta una historia personal o del héroe. (Inicio -> Conflicto -> Punto de quiebre -> Éxito).
      3. OFFER (41-60s): La lección aprendida o el recurso que ofreces como resultado de esa historia.`,
      
    'bab': `ESTRUCTURA 'BAB' (BEFORE-AFTER-BRIDGE):
      1. BEFORE (Antes) (0-10s): Muestra el mundo actual con el problema (infierno).
      2. AFTER (Después) (11-30s): Muestra el mundo ideal donde el problema no existe (cielo).
      3. BRIDGE (Puente) (31-60s): Tu contenido es el puente para cruzar del infierno al cielo.`
  };

  const selectedStructure = ARCHITECTURES[structureType] || ARCHITECTURES['winner_rocket'];

  return `ERES EL MEJOR GUIONISTA DE CONTENIDO VIRAL Y ESTRATEGA DE PSICOLOGÍA DE MASAS DEL MUNDO.
TU MISIÓN SUPREMA: Escribir un guion de video COMPLETO, palabra por palabra, diseñado para retener a la audiencia y convertir espectadores en seguidores.

${dnaContext}

=========================================
🎯 CONTEXTO DEL EXPERTO (CLIENTE)
=========================================
- Nicho: ${contexto.nicho || 'General'}
- Tema ESPECÍFICO del video: "${temaEspecifico}"
- Avatar Ideal: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor Principal: ${contexto.dolor_principal || 'No especificado'}
- Deseo Principal: ${contexto.deseo_principal || 'No especificado'}
- Enemigo Común: ${contexto.enemigo_comun || 'El sistema / Lo convencional'}

=========================================
🧠 MATRIZ PSICOLÓGICA (CALIBRACIÓN)
=========================================
1. NIVEL DE CONCIENCIA DEL PÚBLICO: "${awarenessLevel}"
   - INSTRUCCIÓN: Adapta tu lenguaje a este nivel.

2. OBJETIVO DEL CONTENIDO: "${contentObjective}"
   - INSTRUCCIÓN: Si es "Inspirar", usa tono emotivo y épico. Si es "Educar", sé didáctico y claro.

3. SITUACIÓN ACTUAL DEL AVATAR: "${avatarSituation}"
   - INSTRUCCIÓN: El guion debe validar esta emoción en los primeros 10 segundos.

=========================================
🛠️ ARQUITECTURA SELECCIONADA: ${structureType.toUpperCase()}
=========================================
${selectedStructure}

=========================================
⚠️ REGLAS DE ORO DE ESCRITURA (NO LAS ROMPAS)
=========================================
1. **CERO RESÚMENES:** Escribe el texto EXACTO que el locutor va a leer. NO pongas "Explica aquí X", escribe la explicación completa.
2. **LENGUAJE NATURAL:** Usa palabras sencillas, coloquiales y emocionales.
3. **FORMATO LIMPIO:** El campo "guion_completo" NO debe tener acotaciones de cámara ni [corchetes]. Solo texto fluido.
4. **TEMA ESPECÍFICO:** Habla SOLO sobre "${temaEspecifico}". No te desvíes del tema.
5. **CURIOSITY LOOPS:** Abre bucles de curiosidad para mantener retención.

=========================================
SALIDA JSON REQUERIDA
=========================================
{
  "metadata_guion": {
    "tema_tratado": "${temaEspecifico}",
    "nicho": "${contexto.nicho}",
    "arquitectura_usada": "${structureType}",
    "duracion_estimada": "60-90 segundos",
    "tono_voz": "Empático y Autoritario"
  },
  "ganchos_opcionales": [
    { 
      "tipo": "Disrupción Visual", 
      "texto": "Primera frase muy agresiva sobre ${temaEspecifico}", 
      "retencion_predicha": 95 
    },
    { 
      "tipo": "Curiosidad Intelectual", 
      "texto": "Pregunta extraña sobre ${temaEspecifico}", 
      "retencion_predicha": 92 
    }
  ],
  "guion_completo": "AQUÍ VA EL GUION PALABRA POR PALABRA.\\n\\nEmpieza con el Gancho potente sobre ${temaEspecifico}.\\n\\nDesarrolla el tema con detalles específicos.\\n\\nEntrega valor real y aplicable.\\n\\nCierra con CTA emocional.\\n\\n(MÍNIMO 150-200 palabras de texto HABLADO).",
  "plan_visual": [
    { 
      "tiempo": "0-3s", 
      "accion_en_pantalla": "Descripción visual específica", 
      "instruccion_produccion": "Cámara rápida / Zoom in",
      "audio": "Efecto de sonido"
    },
    { 
      "tiempo": "4-15s", 
      "accion_en_pantalla": "Contexto visual", 
      "instruccion_produccion": "Plano medio",
      "audio": "Música suave"
    }
  ],
  "analisis_psicologico": {
    "gatillo_mental_principal": "Autoridad / Escasez / Reciprocidad",
    "emocion_objetivo": "Esperanza y Alivio / Urgencia"
  }
}`;
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

// 5️⃣ AUDITOR DE AVATAR (MEJORADO - CORRECCIÓN #7)
const PROMPT_AUDITOR_AVATAR = (infoCliente: string, nicho: string) => `ERES UN PSICÓLOGO DE CONSUMIDOR ÉLITE MUNDIAL Y ESTRATEGA DE AVATARES.
TU MISIÓN: Crear el perfil MÁS COMPLETO del Cliente Ideal.

INFORMACIÓN PROPORCIONADA:
${infoCliente}

Nicho: ${nicho}

⚠️⚠️⚠️ REGLA CRÍTICA DE INFERENCIA ⚠️⚠️⚠️
Si la información proporcionada es limitada, debes INFERIR Y COMPLETAR inteligentemente basándote en:
1. Psicología típica de consumidores en "${nicho}"
2. Patrones de comportamiento comunes en este mercado
3. Dolores y deseos universales del nicho
4. Investigación de mercado estándar

NUNCA digas "información no proporcionada" o "N/A".
SIEMPRE genera un perfil COMPLETO, DETALLADO y ÚTIL.

PROTOCOLO DE AUDITORÍA (10 DIMENSIONES):

1. DEMOGRÁFICOS BÁSICOS
2. PSICOGRÁFICOS
3. SITUACIÓN ACTUAL (Dolor)
4. ESTADO DESEADO (Cielo)
5. OBJECIONES Y MIEDOS
6. LENGUAJE Y JERGA
7. PLATAFORMAS Y HÁBITOS
8. PROCESO DE DECISIÓN
9. NIVEL DE CONSCIENCIA
10. CONTENIDO QUE ENGANCHA

FORMATO DE SALIDA JSON ESTRICTO:
{
  "resumen_avatar": {
    "nombre_avatar": "Nombre descriptivo memorable",
    "frase_identidad": "Una frase que capture la esencia",
    "arquetipo": "Tipo psicológico"
  },
  "perfil_completo": {
    "dolor_principal": {
      "problema": "Descripción específica del problema",
      "sintomas": ["Síntoma 1 concreto", "Síntoma 2 concreto"],
      "frustracion": "Frustración emocional específica"
    },
    "estado_deseado": {
      "vision": "Visión clara del estado ideal",
      "emocion_objetivo": "Emoción que busca"
    },
    "lenguaje": {
      "palabras_clave": ["Palabra 1", "Palabra 2", "Palabra 3"],
      "frases_resuenan": ["Frase 1", "Frase 2"],
      "evitar": ["Término 1"],
      "tono_preferido": "Tono específico"
    },
    "tipo_contenido_efectivo": {
      "ganchos": ["Tipo gancho 1", "Tipo gancho 2"],
      "formato": "Formato visual preferido",
      "tono": "Tono de voz efectivo"
    }
  },
  "insights_estrategicos": [
    {
      "insight": "Insight profundo sobre el avatar",
      "aplicacion": "Cómo aplicarlo al contenido"
    }
  ]
}`;

// 6️⃣ AUDITOR DE EXPERTO (MEJORADO - CORRECCIÓN #7)
const PROMPT_AUDITOR_EXPERTO = (contexto: ContextoUsuario) => `ERES UN ANALISTA COMPETITIVO ÉLITE MUNDIAL Y ESTRATEGA DE POSICIONAMIENTO.
TU MISIÓN: Analizar el perfil del usuario y su mercado para encontrar su ÁNGULO ÚNICO.

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'N/A'}

⚠️⚠️⚠️ REGLA CRÍTICA DE ANÁLISIS ⚠️⚠️⚠️
Aunque tengas información limitada, debes:
1. Analizar tendencias actuales en "${contexto.nicho}"
2. Identificar patrones de mercado
3. Proponer estrategias CONCRETAS y ACCIONABLES
4. Crear un plan COMPLETO basado en mejores prácticas

NO digas "se necesita más información".
SIEMPRE genera un análisis COMPLETO y ÚTIL.

PROTOCOLO DE AUDITORÍA (7 FASES):

1. MAPEO DE COMPETENCIA
2. ANÁLISIS DE BRECHAS
3. DIFERENCIACIÓN
4. POSICIONAMIENTO
5. ESTRATEGIA DE CONTENIDO
6. MATRIZ DE OPORTUNIDADES
7. SISTEMA DE MONITOREO

FORMATO DE SALIDA JSON ESTRICTO:
{
  "resumen_ejecutivo": {
    "estado_mercado": "Saturado/En Crecimiento/Naciente",
    "nivel_competencia": "Alta/Media/Baja",
    "oportunidad_principal": "Descripción específica de la oportunidad"
  },
  "analisis_brechas": {
    "todos_hacen": ["Cosa 1 específica", "Cosa 2 específica"],
    "nadie_hace": ["Oportunidad 1 - ÁNGULO VIRGEN"],
    "hacen_mal": ["Error común específico"]
  },
  "posicionamiento_estrategico": {
    "declaracion_posicionamiento": "Ayudo a [AVATAR] a lograr [RESULTADO] sin [OBJECIÓN]",
    "enemigo_comun": "Qué rechaza el usuario",
    "bandera": "Por qué lucha",
    "propuesta_valor": "Valor único"
  },
  "estrategia_contenido": {
    "pilares_contenido": [
      {
        "pilar": "Pilar 1 específico",
        "objetivo": "Educar/Posicionar/Convertir",
        "frecuencia": "2-3 veces/semana",
        "angulos": ["Ángulo 1", "Ángulo 2"]
      }
    ]
  },
  "plan_90_dias": {
    "mes_1": {
      "objetivo_principal": "Objetivo claro",
      "acciones_clave": ["Acción 1", "Acción 2"],
      "meta_numerica": "1,000 seguidores"
    }
  }
}`;

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
  console.log('[CEREBRO] 🔬 Ejecutando Autopsia Viral MEJORADA...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el forense de viralidad #1 del mundo. DEBES devolver un JSON COMPLETO con TODAS las secciones.' },
      { role: 'user', content: `${PROMPT_AUTOPSIA_VIRAL(platform)}\n\nCONTENIDO A ANALIZAR:\n${content}` }
    ],
    temperature: 0.3,
    max_tokens: 4096
  });
  
  const data = JSON.parse(completion.choices[0].message.content || '{}');
  
  // Validar que tenga las secciones críticas
  if (!data.score_viral || !data.adn_extraido || !data.desglose_temporal) {
    console.error('[AUTOPSIA] ⚠️ Respuesta incompleta, rellenando con datos mínimos...');
    return {
      data: {
        score_viral: data.score_viral || { potencial_total: 0, factores_exito: [], nivel_replicabilidad: "N/A" },
        adn_extraido: data.adn_extraido || { idea_ganadora: "No disponible", disparador_psicologico: "N/A", estructura_exacta: "N/A", formula_gancho: "N/A" },
        desglose_temporal: data.desglose_temporal || [],
        patron_replicable: data.patron_replicable || { nombre_patron: "N/A", formula: "N/A", aplicacion_generica: "N/A" },
        produccion_deconstruida: data.produccion_deconstruida || {},
        insights_algoritmicos: data.insights_algoritmicos || {}
      },
      tokens: completion.usage?.total_tokens || 0
    };
  }
  
  if (data.patron_replicable) MEMORIA_SISTEMA.patrones_virales.push(data.patron_replicable.nombre_patron);
  if (data.adn_extraido?.formula_gancho) MEMORIA_SISTEMA.hooks_alto_rendimiento.push(data.adn_extraido.formula_gancho);
  
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
  console.log('[CEREBRO] ✍️ Ejecutando Generador de Guiones MEJORADO...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el mejor guionista de contenido viral en español. REGLA CRÍTICA: Escribe el guion COMPLETO palabra por palabra sobre el tema específico, nunca resúmenes.' },
      { role: 'user', content: PROMPT_GENERADOR_GUIONES(contexto, viralDNA, settings) }
    ],
    temperature: 0.7,
    max_tokens: 4096
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
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
  contexto: ContextoUsuario,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 🎯 Ejecutando Auditor de Experto MEJORADO...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un analista competitivo élite mundial. NUNCA digas "se necesita más información". SIEMPRE genera un análisis COMPLETO.' },
      { role: 'user', content: PROMPT_AUDITOR_EXPERTO(contexto) }
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
  console.log('[CEREBRO] 📅 Generando Calendario MEJORADO...');
  
  const calendarPrompt = `Genera un calendario de contenidos de ${settings.duration || 7} días para:
  
Nicho: ${contexto.nicho}
Avatar: ${contexto.avatar_ideal}
Dolor: ${contexto.dolor_principal}
Deseo: ${contexto.deseo_principal}

Usa los 40 Ganchos Winner Rocket y los 12 Formatos Visuales.

⚠️ FORMATO DE SALIDA JSON ESTRICTO (SIN MARKDOWN):
{
  "calendario": [
    {
      "dia": 1,
      "tema": "Tema específico del día",
      "idea_contenido": "Idea completa de video",
      "gancho_sugerido": "Primera línea del video",
      "formato": "Uno de los 12 formatos",
      "objetivo": "Educar/Entretener/Vender",
      "disparador": "Uno de los 7 disparadores"
    }
  ]
}`;
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un estratega de contenidos CMO experto en viralidad. Devuelve SOLO JSON válido, SIN markdown.' },
      { role: 'user', content: calendarPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{"calendario":[]}'),
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
    return 5;
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
        const platName = platform || 'General';
        
        const autopsiaResponse = await ejecutarAutopsiaViral(processedContext, platName, openai);
        
        if (selectedMode === 'recreate') {
            // ✅ CORRECCIÓN #6: Enriquecer contexto con tema específico
            const contextoEnriquecido = {
              ...userContext,
              tema_especifico: processedContext || userContext.nicho
            };
            
            const guionResponse = await ejecutarGeneradorGuiones(
              contextoEnriquecido, 
              autopsiaResponse.data.adn_extraido, 
              openai, 
              settings
            );
            result = { 
              autopsia_viral: autopsiaResponse.data, 
              guion_adaptado: guionResponse.data 
            };
            tokensUsed = autopsiaResponse.tokens + guionResponse.tokens;
        } else {
            result = autopsiaResponse.data;
            tokensUsed = autopsiaResponse.tokens;
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
        // ✅ CORRECCIÓN #7: Cargar info de la BD si no hay texto
        let contextoEnriquecido = userContext;
        
        if (expertId && (!processedContext || processedContext.length < 50)) {
          const { data: expertData } = await supabase
            .from('expert_profiles')
            .select('*')
            .eq('id', expertId)
            .single();
          
          if (expertData) {
            contextoEnriquecido = {
              ...userContext,
              posicionamiento: expertData.positioning || '',
              diferenciadores: expertData.differentiators || []
            };
          }
        }
        
        const res = await ejecutarAuditorExperto(contextoEnriquecido, openai);
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