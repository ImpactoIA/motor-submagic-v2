// ==================================================================================
//  🚀 TITAN ENGINE V105 DEFINITIVO - VERSIÓN CORREGIDA Y ORDENADA
// ==================================================================================
//  ✅ IMPORTS CORREGIDOS (URLs completas de Deno)
//  ✅ FUNCIONES EJECUTORAS EN EL ORDEN CORRECTO (ANTES DEL SERVE)
//  ✅ TODOS LOS PROMPTS V300 PRESERVADOS (100% intactos)
//  ✅ SCRAPERS + WHISPER COMPLETOS
//  ✅ SISTEMA DE COBROS ALINEADO
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

const PROMPT_IDEAS_ELITE = (
  temaEspecifico: string,
  cantidad: number,
  plataforma: string,
  contexto: ContextoUsuario
) => `
═════════════════════════════════════════════════════════════════════════════
🧠 GENERADOR DE IDEAS VIRALES ULTRA-CONTEXTUAL - TITAN ENGINE
═════════════════════════════════════════════════════════════════════════════

ERES EL GENIO CREATIVO DE CONTENIDO VIRAL #1 EN ESPAÑOL.
TU MISIÓN: Generar EXACTAMENTE ${cantidad} ideas de video EXPLOSIVAS sobre:

🎯 TEMA ESPECÍFICO DEL USUARIO:
"${temaEspecifico}"

📱 PLATAFORMA DESTINO:
${plataforma}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CONTEXTO DEL EXPERTO (ÚSALO RELIGIOSAMENTE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 NICHO: ${contexto.nicho || 'General'}
🔹 AVATAR IDEAL: ${contexto.avatar_ideal || 'Audiencia general'}
🔹 DOLOR PRINCIPAL: ${contexto.dolor_principal || 'N/A'}
🔹 DESEO PRINCIPAL: ${contexto.deseo_principal || 'N/A'}

${contexto.knowledge_base_content ? `
🧠 BASE DE CONOCIMIENTO:
"${contexto.knowledge_base_content.substring(0, 800)}..."

⚠️ CRÍTICO: Usa ESTA información para generar ideas. No inventes contenido genérico.
` : ''}

${contexto.hooks_exitosos?.length > 0 ? `
🎣 HOOKS EXITOSOS PREVIOS (REPLICA EL PATRÓN):
${contexto.hooks_exitosos.slice(0, 5).map((h, i) => `${i + 1}. ${h}`).join('\n')}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 ESPECIFICACIONES DE PLATAFORMA: ${plataforma}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${plataforma === 'TikTok' ? `
✅ FORMATO: Videos verticales 9:16, 15-60 segundos
✅ GANCHOS: Primeros 0.5s críticos, texto en pantalla obligatorio
✅ ESTILO: Dinámico, rápido, música trending, cortes cada 2-3s
✅ TONO: Casual, auténtico, directo, sin fluff corporativo
✅ KEYWORDS: #ParaTi #Viral #Trending + 2 de nicho
` : plataforma === 'Reels' ? `
✅ FORMATO: Videos verticales 9:16, 15-90 segundos
✅ GANCHOS: Visual primero, texto después. Loops al final
✅ ESTILO: Estético, transiciones smooth, música de Instagram
✅ TONO: Inspiracional, aspiracional, belleza visual
✅ KEYWORDS: 3 hashtags grandes + 2 nicho
` : plataforma === 'YouTube' ? `
✅ FORMATO: Horizontal 16:9, 8-15 minutos (Shorts: vertical 60s)
✅ GANCHOS: Título clickbait ético + thumbnail impactante
✅ ESTILO: Narrativa más larga, storytelling, valor educativo
✅ TONO: Profesional pero conversacional, autoridad
✅ KEYWORDS: SEO en título, descripción optimizada
` : plataforma === 'LinkedIn' ? `
✅ FORMATO: Cuadrado 1:1 o vertical, 30-90 segundos
✅ GANCHOS: Estadística impactante o pregunta profesional
✅ ESTILO: Pulido, profesional, valor B2B, insights de industria
✅ TONO: Experto pero accesible, thought leadership
✅ KEYWORDS: Industria, profesión, caso de uso corporativo
` : `
✅ FORMATO: Cuadrado 1:1, 30-90 segundos
✅ GANCHOS: Emocional o controversial (moderado)
✅ ESTILO: Conversacional, relatable, community-driven
✅ TONO: Amigable, cercano, storytelling personal
`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 BIBLIOTECAS DE CONOCIMIENTO WINNER ROCKET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${MASTER_HOOKS_STR}

${VIDEO_FORMATS_STR}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ PROTOCOLO DE GENERACIÓN (SIGUE RELIGIOSAMENTE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **ANALIZA EL TEMA**: "${temaEspecifico}"
2. **CONECTA CON EL DOLOR**: ${contexto.dolor_principal}
3. **APLICA LOS 7 DISPARADORES VIRALES**
4. **DIVERSIFICA LOS FORMATOS**
5. **CALCULA SCORE VIRAL REAL**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 FORMATO DE SALIDA JSON (EXACTO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "ideas": [
    {
      "id": 1,
      "titulo": "Título ultra específico (Max 60 chars)",
      "concepto": "Descripción potente en 1-2 frases",
      "disparador_principal": "Curiosidad/Miedo/Deseo/Urgencia/Identidad/Controversia/Transformación",
      "gancho_sugerido": "Primera línea EXACTA del video",
      "potencial_viral": 8.5,
      "razon_potencia": "Por qué esta idea puede explotar",
      "formato_visual": "Uno de los 12 formatos Winner Rocket",
      "angulo": "El ángulo único",
      "cta_sugerido": "Llamado a la acción",
      "plataforma_ideal": "${plataforma}",
      "duracion_recomendada": "15-30s / 30-60s / 60-90s",
      "dificultad_produccion": "Baja / Media / Alta",
      "keywords": ["#keyword1", "#keyword2"]
    }
  ],
  
  "recomendacion_top": {
    "idea_id": 3,
    "razon": "Por qué ESTA es la mejor opción AHORA",
    "plan_rapido": "3 pasos concretos para ejecutarla hoy"
  },

  "insights_estrategicos": {
    "tendencia_detectada": "Qué tendencia hace que estas ideas funcionen ahora",
    "brecha_mercado": "Qué NO está haciendo la competencia",
    "advertencia": "Qué evitar"
  }
}

⚠️ REGLAS INQUEBRANTABLES:
1. Genera EXACTAMENTE ${cantidad} ideas
2. Todas en ESPAÑOL NEUTRO
3. Todas sobre: "${temaEspecifico}"
4. Todas para ${plataforma}

🚀 ¡CREA MAGIA! 🎬✨
`;

const PROMPT_AUTOPSIA_VIRAL = (platform: string) => `
ERES EL FORENSE DE VIRALIDAD #1 DEL MUNDO.
TU MISIÓN: Deconstruir videos virales hasta sus componentes atómicos y extraer el ADN replicable.

PLATAFORMA: ${platform}

⚠️ REGLA ULTRA CRÍTICA: Debes devolver un JSON COMPLETO Y VÁLIDO con TODAS las secciones.

FORMATO DE SALIDA JSON ESTRICTO:
{
  "score_viral": {
    "potencial_total": 9.2,
    "factores_exito": ["Factor 1", "Factor 2", "Factor 3"],
    "nivel_replicabilidad": "Alta/Media/Baja"
  },
  "adn_extraido": {
    "idea_ganadora": "La idea central en una frase potente",
    "disparador_psicologico": "El mecanismo mental principal",
    "estructura_exacta": "Nombre del formato",
    "formula_gancho": "[ELEMENTO 1] + [ELEMENTO 2]"
  },
  "desglose_temporal": [
    {
      "segundo": "0-3",
      "que_pasa": "Descripción visual",
      "porque_funciona": "Mecanismo psicológico",
      "replicar_como": "Instrucción clara"
    }
  ],
  "patron_replicable": {
    "nombre_patron": "Nombre descriptivo",
    "formula": "PASO 1 + PASO 2 + PASO 3",
    "aplicacion_generica": "Cómo usar esto"
  },
  "produccion_deconstruida": {
    "visuales_clave": ["Elemento 1", "Elemento 2"],
    "ritmo_cortes": "Cada X segundos",
    "movimiento_camara": "Descripción",
    "musica_sonido": "Tipo de audio"
  },
  "insights_algoritmicos": {
    "optimizacion_retencion": "Táctica específica",
    "triggers_engagement": "Qué dispara interacción",
    "seo_keywords": ["Keyword 1", "Keyword 2"]
  }
}`;

// ==================================================================================
// 💎 PROMPT TITAN V9: CLONACIÓN SINTÁCTICA ESTRICTA (EL ESPEJO)
// ==================================================================================

const PROMPT_INGENIERIA_INVERSA_ELITE = (
  adnViral: any, 
  nichoDestino: string, 
  temaEspecifico: string,
  contextoUsuario: any
) => {
  
  const avatarDestino = contextoUsuario.avatar_ideal || "Tu Cliente";
  const dolorDestino = contextoUsuario.dolor_principal || "Perder Dinero/Tiempo";
  
  // Extraemos la "Fórmula"
  const estructura = JSON.stringify(adnViral.desglose_temporal || []);
  const formulaGancho = adnViral.adn_extraido?.formula_gancho || "Afirmación Polémica";

  return `
═════════════════════════════════════════════════════════════════════════════
 🪞 SISTEMA TITAN V9: CLONACIÓN SINTÁCTICA (EL ESPEJO VIRAL)
═════════════════════════════════════════════════════════════════════════════

ERES UNA MÁQUINA DE REEMPLAZO DE VARIABLES. NO ERES UN ESCRITOR CREATIVO.
Tu única misión es tomar la frase viral del video original y cambiarle las palabras clave por las del nicho: "${nichoDestino}".

OPERACIÓN: "DESNUDAR Y VESTIR"
1. Desnuda la frase original (Halla la estructura gramatical).
2. Viste la frase con el tema: "${temaEspecifico}".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 EJEMPLOS DE LO QUE DEBES HACER (LÓGICA MATEMÁTICA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CASO 1: ESTRUCTURA DE PORCENTAJE
- Original (Nutrición): "El 80% de la gente come mal."
- Tu Nicho (Marketing): "El 80% de la gente vende mal."
(✅ MANTIENES EL NÚMERO, CAMBIAS EL VERBO).

CASO 2: ESTRUCTURA DE CONDICIÓN
- Original (Relaciones): "Si él no te llama, no le importas."
- Tu Nicho (Bienes Raíces): "Si la casa no se vende, el precio está mal."
(✅ MANTIENES LA LÓGICA "SI X -> ENTONCES Y").

CASO 3: ESTRUCTURA DE NEGACIÓN
- Original (Fitness): "Deja de hacer cardio si quieres músculo."
- Tu Nicho (Crypto): "Deja de hacer trading si quieres riqueza."
(✅ MANTIENES EL IMPERATIVO "DEJA DE").

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 EL ADN A CLONAR (INPUT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• FÓRMULA DEL GANCHO ORIGINAL: "${formulaGancho}"
• ESTRUCTURA DE TIEMPOS: ${estructura}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ REGLAS DE ORO (STRICT MODE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. RESPETA LOS NÚMEROS: Si el viral dice "3 errores", tú dices "3 errores". Si dice "80%", tú dices "80%".
2. RESPETA LA INTENSIDAD: Si el original insulta o es agresivo, tú debes ser agresivo con el dolor del usuario (${dolorDestino}).
3. NO AÑADAS RELLENO: Si el original dura 15 segundos y dice 30 palabras, tú escribe 30 palabras. Ni una más.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 TU SALIDA (EL GUION CLONADO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Genera un JSON con:
1. "analisis_estrategico": Explica qué patrón sintáctico detectaste y reemplazaste (Ej: "Patrón detectado: [Porcentaje] + [Error]. Reemplazo: Comer -> Lanzar").
2. "guion_tecnico_completo": El guion final.
3. "plan_visual_director": Las instrucciones de cámara idénticas al original.
`;
};


// 🧠 GENERADOR DE GUIONES - ULTRA MEJORADO CON CONOCIMIENTO EXPERTO
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


const PROMPT_JUEZ_VIRAL = (contexto: ContextoUsuario, contenido: string) => `
ERES EL ALGORITMO HUMANO MÁS PRECISO PARA PREDECIR VIRALIDAD.

CONTEXTO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'General'}

CONTENIDO A EVALUAR:
${contenido}

FORMATO JSON:
{
  "veredicto_final": {
    "score_total": 85,
    "clasificacion": "ALTO POTENCIAL",
    "probabilidad_viral": "78%"
  },
  "evaluacion_criterios": [
    { "criterio": "Gancho", "score": 9, "analisis": "...", "sugerencia": "..." }
  ],
  "decision_recomendada": "PUBLICAR"
}`;

// ==================================================================================
// 🧠 CEREBRO DEL AUDITOR: MODO "GRANDMASTER"
// ==================================================================================

const PROMPT_AUDITOR_AVATAR = (infoCliente: string, nicho: string) => `
ACTÚA COMO: "TITAN AUDIT", el Consultor de Estrategia y Psicología del Consumidor más caro y despiadado del mundo.
Tu trabajo no es ser amable. Tu trabajo es salvar al usuario de perder dinero por tener un Avatar mediocre.

CONTEXTO DE LA MISIÓN:
El usuario ha definido un "Cliente Ideal" (Avatar). Debes someterlo a una AUDITORÍA FORENSE.

DATOS DEL AVATAR:
${infoCliente}

NICHO DEL MERCADO: ${nicho}

CRITERIOS DE EVALUACIÓN (TOLERANCIA CERO):
1. **ESPECIFICIDAD RADICAL:** "Quiere bajar de peso" = BASURA. "Quiere perder 5kg para entrar en su vestido de novia" = ORO.
2. **DOLOR SANGRIENTO:** ¿Es una molestia o una urgencia? Si no duele, no compran.
3. **COHERENCIA:** ¿El nivel de ingresos coincide con la ocupación? ¿El miedo coincide con el deseo?

TU SALIDA DEBE SER UN JSON ESTRICTO CON ESTA ESTRUCTURA:

{
  "auditoria_calidad": {
    "score_global": 0, // Sé duro. 0-50 es mediocre, 51-80 es bueno, 81-100 es legendario.
    "nivel_actual": "Novato / Amateur / Profesional / Titan",
    "veredicto_brutal": "Una frase de impacto que resuma la realidad. Ej: 'Este avatar es un fantasma, nadie se identifica con esto' o 'Sólido como una roca'."
  },
  "analisis_campo_por_campo": [
    // ANALIZA CADA CAMPO CRÍTICO QUE EL USUARIO LLENÓ (MÍNIMO 3)
    {
      "campo": "Nombre del Campo (Ej: Dolor Principal)",
      "lo_que_escribio_usuario": "Resumen breve...",
      "calificacion": "🟢 Excelente / 🟡 Mejorable / 🔴 Pobre / ⚫ Desastroso",
      "critica": "Explicación psicológica de por qué sirve o no sirve.",
      "correccion_maestra": "Reescribe el campo como lo haría un experto en copywriting de 7 cifras."
    }
  ],
  "perfil_final_optimizado": {
    "identidad": "Quién es esta persona realmente en 1 frase.",
    "insight_psicologico": "Un secreto oscuro o deseo inconfesable que este avatar tiene y que el usuario pasó por alto."
  }
}

REGLAS DE ORO:
- Si el usuario escribe poco, CALIFICA BAJO.
- Si es genérico, DESTROZALO en la crítica.
- La "correccion_maestra" debe ser LISTA PARA USAR en un anuncio.
- NO uses Markdown. SOLO JSON PURO.
`;

const PROMPT_AUDITOR_EXPERTO = (infoExperto: string, nicho: string) => `
ERES "TITAN STRATEGY", EL ESTRATEGA IMPLACABLE.

INFORMACIÓN: ${infoExperto}
NICHO: ${nicho}

FORMATO JSON:
{
  "auditoria_calidad": { "score_global": 0, "nivel_autoridad": "Novato" },
  "analisis_campo_por_campo": [
    { "campo": "Historia", "calificacion": "🟢", "critica": "...", "correccion_maestra": "..." }
  ],
  "perfil_experto_optimizado": {
    "posicionamiento_unico": "...",
    "nombre_metodo_comercial": "..."
  }
}`;

const PROMPT_MENTOR_ESTRATEGICO = (contexto: ContextoUsuario, resultados?: any) => {
  const resultadosStr = resultados ? `\nRESULTADOS:\n${JSON.stringify(resultados)}` : '';
  
  return `ERES UN MENTOR DE ÉLITE.

CONTEXTO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'N/A'}${resultadosStr}

FORMATO JSON:
{
  "diagnostico_actual": {
    "estado_general": "En camino",
    "score_ejecucion": 7.5
  },
  "estrategia_optimizada": {
    "ajustes_inmediatos": [{"area": "Ganchos", "cambio": "...", "impacto_esperado": "Alto"}]
  }
}`;
}

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
// ⭐ FUNCIONES EJECUTORAS (ANTES DEL SERVE - POSICIÓN CORRECTA)
// ==================================================================================

async function ejecutarIdeasRapidas(
  topic: string,
  quantity: number,
  platform: string,
  contexto: any, 
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log(`[CEREBRO] 💡 Generando ${quantity} ideas sobre: "${topic}" para ${platform}`);
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { 
        role: 'system', 
        content: 'Eres el genio creativo #1 del mundo.' 
      },
      { 
        role: 'user', 
        content: PROMPT_IDEAS_ELITE(topic, quantity, platform, contexto)
      }
    ],
    temperature: 0.85,
    max_tokens: quantity === 10 ? 4000 : 2500
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
      { role: 'system', content: 'Eres el forense de viralidad #1. DEBES devolver JSON COMPLETO.' },
      { role: 'user', content: `${PROMPT_AUTOPSIA_VIRAL(platform)}\n\nCONTENIDO:\n${content}` }
    ],
    temperature: 0.3,
    max_tokens: 4096
  });
  
  const data = JSON.parse(completion.choices[0].message.content || '{}');
  
  if (!data.score_viral || !data.adn_extraido) {
    console.warn('[AUTOPSIA] ⚠️ Respuesta incompleta detectada.');
  }
  
  return {
    data,
    tokens: completion.usage?.total_tokens || 0
  };
}

// ==================================================================================
// 🧠 CEREBRO AGÉNTICO: PLANIFICADOR + EJECUTOR (NIVEL ELITE)
// ==================================================================================

async function ejecutarGeneradorGuiones(
  contexto: any,
  viralDNA: any | null,
  openai: any,
  settings: any = {}
): Promise<{ data: any; tokens: number }> {
  
  console.log('[CEREBRO] 🧠 Iniciando Protocolo Agéntico de Doble Paso...');
  let tokensTotal = 0;

  // --------------------------------------------------------------------------
  // PASO 1: EL ESTRATEGA (Reasoning Phase)
  // --------------------------------------------------------------------------
  // Antes de escribir, la IA debe "pensar" la estructura perfecta.
  // Esto evita alucinaciones y mejora la adaptación al nicho.
  
  console.log('[PASO 1] ♟️ El Estratega está diseñando la estructura...');
  
  let promptEstrategia = "";
  if (viralDNA) {
    promptEstrategia = `
      ANALIZA este ADN Viral: ${JSON.stringify(viralDNA.adn_extraido)}
      OBJETIVO: Adaptarlo al nicho "${settings.manual_niche || contexto.nicho}".
      TAREA: Crea un ESQUEMA LÓGICO paso a paso de cómo adaptar la historia/estructura original al nuevo nicho.
      NO escribas el guion aún. Solo define los puntos clave de la trama y cómo disparar la emoción en el nuevo público.
    `;
  } else {
    promptEstrategia = `
      OBJETIVO: Crear un guion viral para "${contexto.tema_especifico}" en el nicho "${contexto.nicho}".
      TAREA: Diseña una estructura ganadora (Gancho -> Retención -> Payoff).
      Define qué sesgos psicológicos usarás en cada segundo.
    `;
  }

  const estrategia = await openai.chat.completions.create({
    model: 'gpt-4o', // Usamos modelo rápido o el mismo 4o
    messages: [
      { role: 'system', content: 'Eres un Estratega de Marketing Viral de clase mundial.' },
      { role: 'user', content: promptEstrategia }
    ],
    temperature: 0.7
  });

  const planEstrategico = estrategia.choices[0].message.content;
  tokensTotal += estrategia.usage?.total_tokens || 0;

  // --------------------------------------------------------------------------
  // PASO 2: EL EJECUTOR (Writing Phase)
  // --------------------------------------------------------------------------
  // Ahora la IA escribe basándose en el plan maestro, no en el vacío.
  
  console.log('[PASO 2] ✍️ El Guionista está ejecutando el plan...');

  let systemPrompt: string;
  let temperature: number;
  let roleContent: string;

  if (viralDNA && viralDNA.adn_extraido) {
    // MODO CLONACIÓN
    systemPrompt = PROMPT_INGENIERIA_INVERSA_ELITE(
      viralDNA,
      settings.manual_niche || contexto.nicho, 
      contexto.tema_especifico,
      contexto
    );
    // LE INYECTAMOS EL PLAN ESTRATÉGICO AL PROMPT
    systemPrompt += `\n\n🛡️ INSTRUCCIÓN DE MANDO: Sigue estrictamente este PLAN ESTRATÉGICO que acabas de diseñar:\n${planEstrategico}`;
    
    temperature = 0.4; 
    roleContent = 'Eres el Arquitecto de Viralidad #1 (Omega V5).';
  } else {
    // MODO ORIGINAL
    systemPrompt = PROMPT_GENERADOR_GUIONES(contexto, null, settings);
    systemPrompt += `\n\n🛡️ INSTRUCCIÓN DE MANDO: Ejecuta el guion basándote en tu análisis previo:\n${planEstrategico}`;
    
    temperature = 0.7; 
    roleContent = 'Eres el Mejor Guionista Viral del Mundo (Titan V400).';
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o', 
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: roleContent },
      { role: 'user', content: systemPrompt }
    ],
    temperature,
    max_tokens: 4096
  });

  tokensTotal += completion.usage?.total_tokens || 0;
  const parsedData = JSON.parse(completion.choices[0].message.content || '{}');

  // --------------------------------------------------------------------------
  // PASO 3: NORMALIZACIÓN Y ENTREGA
  // --------------------------------------------------------------------------
  const normalizedData = {
    ...parsedData,
    guion_tecnico_completo: parsedData.guion_tecnico_completo || parsedData.guion_completo || parsedData.guion_completo_adaptado,
    plan_visual_director: parsedData.plan_visual_director || parsedData.plan_visual,
    // Agregamos el "razonamiento oculto" para que el usuario vea por qué la IA hizo lo que hizo (Opcional)
    analisis_estrategico: {
        ...(parsedData.analisis_estrategico || {}),
        razonamiento_interno: "Planificación Estratégica Ejecutada"
    }
  };

  return {
    data: normalizedData,
    tokens: tokensTotal
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
      { role: 'system', content: 'Eres el algoritmo más preciso para predecir viralidad.' },
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
  console.log('[CEREBRO] 👤 Ejecutando Auditor de Avatar...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un psicólogo de consumidor élite.' },
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
  infoExperto: string,
  nicho: string,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 🎯 Ejecutando Auditor de Experto...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres Titan Strategy, el consultor implacable.' },
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
      { role: 'system', content: 'Eres un mentor de élite.' },
      { role: 'user', content: `${PROMPT_MENTOR_ESTRATEGICO(contexto, resultados)}\n\nCONSULTA: ${query}` }
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
  return 'unknown';
}

async function scrapeTikTok(url: string): Promise<{ videoUrl: string; description: string; transcript?: string }> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');
  if (!apifyToken) throw new Error('APIFY_API_TOKEN no configurado');

  console.log('[SCRAPER] 🎬 Iniciando scraping de TikTok:', url);

  const client = new ApifyClient({ token: apifyToken });

  const run = await client.actor('clockworks/tiktok-scraper').call({
    postURLs: [url],
    resultsPerPage: 1,
    shouldDownloadVideos: true,
    shouldDownloadCovers: false,
    shouldDownloadSubtitles: false
  });

  console.log('[SCRAPER] ⏳ Esperando resultados...');

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
    transcript: videoData.text || ''
  };
}

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
    videoUrl: url,
    description: videoData.description || '',
    transcript: videoData.subtitles || videoData.text || ''
  };
}

async function transcribeVideoWithWhisper(videoUrl: string, openai: any): Promise<{ transcript: string; duration: number }> {
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
    let baseCost = 5;
    
    if (whisperMinutes > 0) {
        const whisperCostInDollars = whisperMinutes * 0.006;
        const whisperCostInCredits = Math.ceil(whisperCostInDollars / 0.01);
        baseCost += whisperCostInCredits;
    }
    
    return baseCost;
  }

  if (mode === 'recreate') {
    let baseCost = 10;
    
    if (whisperMinutes > 0) {
        const whisperCostInDollars = whisperMinutes * 0.006;
        const whisperCostInCredits = Math.ceil(whisperCostInDollars / 0.01);
        baseCost += whisperCostInCredits;
    }
    
    if (whisperMinutes > 30) {
        baseCost += 15;
    }
    
    return baseCost;
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
    
    let settings: any = {};
    if (body.quantity) settings.quantity = body.quantity;
    if (body.duration) settings.duration = body.duration;
    if (body.durationId) settings.durationId = body.durationId;
    if (body.structure) settings.structure = body.structure;
    if (body.awareness) settings.awareness = body.awareness;
    if (body.objective) settings.objective = body.objective;
    if (body.situation) settings.situation = body.situation;
    if (body.platform) settings.platform = body.platform;

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

    // ==================================================================================
    // 🎯 SWITCH CASE
    // ==================================================================================

    switch (selectedMode) {
      case 'ideas_rapidas': {
        const topic = body.topic || body.userInput || processedContext || "Ideas Virales";
        const quantity = settings.quantity || 3; 
        const platform = settings.platform || 'TikTok';
        
        console.log(`[IDEAS] Topic: "${topic}" | Qty: ${quantity} | Platform: ${platform}`);
        
        const res = await ejecutarIdeasRapidas(topic, quantity, platform, userContext, openai);
        
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
        console.log(`[TITAN] 🚀 Modo: ${selectedMode}`);

        let contentToAnalyze = "";
        let targetTopic = processedContext;
        let platName = platform || 'General';
        let videoDescription = '';
        let actualWhisperMinutes = 0;
        let videoSource: 'url' | 'upload' | 'manual' = 'manual';

        try {
            if (url || body.uploadedVideo) {
                console.log('[TITAN] 🎬 Obteniendo contenido...');
                
                const videoData = await getVideoContent(
                    url || null,
                    body.uploadedVideo || null,
                    body.uploadedFileName || null,
                    openai
                );
                
                contentToAnalyze = videoData.transcript;
                videoDescription = videoData.description;
                platName = videoData.platform;
                videoSource = videoData.source;
                
                if (videoData.duration > 0) {
                    actualWhisperMinutes = Math.ceil(videoData.duration / 60);
                    whisperMinutes = actualWhisperMinutes;
                }
                
                console.log('[TITAN] ✅ Contenido obtenido:', {
                    source: videoSource,
                    platform: platName,
                    transcriptLength: contentToAnalyze.length,
                    whisperMinutes: actualWhisperMinutes
                });
            }
            else if (processedContext && processedContext.length > 50) {
                console.log('[TITAN] 📝 Usando texto manual');
                contentToAnalyze = processedContext;
                videoDescription = 'Transcripción manual';
                videoSource = 'manual';
            }
            else {
                throw new Error('Proporciona URL, video subido, o transcripción manual.');
            }

        } catch (videoError: any) {
            console.error('[TITAN] ❌ Error:', videoError.message);
            
            if (processedContext && processedContext.length > 50) {
                console.log('[TITAN] ⚠️ Usando texto manual como último recurso');
                contentToAnalyze = processedContext;
                videoSource = 'manual';
            } else {
                throw new Error(`Error: ${videoError.message}`);
            }
        }

        if (!contentToAnalyze || contentToAnalyze.length < 20) {
            throw new Error('Contenido insuficiente para análisis (mínimo 20 caracteres).');
        }

        console.log('[TITAN] 🔬 Ejecutando autopsia...');
        
        const autopsiaRes = await ejecutarAutopsiaViral(
            contentToAnalyze, 
            platName, 
            openai
        );
        
        const adnViral = autopsiaRes.data;

        if (selectedMode === 'recreate') {
            console.log(`[RECREATE] 🧬 Clonando al nicho: "${targetTopic}"...`);
            
            const contextoRecreate = { 
                ...userContext, 
                tema_especifico: targetTopic || userContext.nicho 
            };
            
            const guionRes = await ejecutarGeneradorGuiones(
                contextoRecreate, 
                adnViral,
                openai, 
                settings
            );
            
            result = {
                autopsia: adnViral,
                guion_generado: guionRes.data,
                modo: "ingenieria_inversa_exitosa",
                metadata_video: {
                    source: videoSource,
                    platform: platName,
                    description: videoDescription,
                    whisper_used: actualWhisperMinutes > 0,
                    whisper_minutes: actualWhisperMinutes,
                    original_url: url || null,
                    uploaded_file: body.uploadedFileName || null
                }
            };
            
            tokensUsed = autopsiaRes.tokens + guionRes.tokens;

        } else {
            console.log('[AUTOPSIA] 📊 Devolviendo análisis...');
            
            result = {
                ...adnViral,
                metadata_video: {
                    source: videoSource,
                    platform: platName,
                    description: videoDescription,
                    whisper_used: actualWhisperMinutes > 0,
                    whisper_minutes: actualWhisperMinutes,
                    original_url: url || null,
                    uploaded_file: body.uploadedFileName || null
                }
            };
            
            tokensUsed = autopsiaRes.tokens;
        }
        
        break;
      }

      // ==================================================================================
        // 🎬 MODO: GENERADOR DE GUIONES (SCRIPT GENERATOR)
        // ==================================================================================
        case 'generar_guion': {
            console.log('[MODE] ✨ Generar Guion Original');

            // 1. Capturar el Tema (Prioridad: Input directo > Contexto procesado > Nicho > Default)
            // 'body.text' es lo que envías desde el input "Tu Nicho / Tema" en el frontend
            const temaUsuario = body.text || processedContext || settings.topic || userContext.nicho || "Tema General";
            
            console.log(`[GENERADOR] 🎯 Tema: "${temaUsuario}" | Estructura: ${settings.structure || 'Estándar'}`);

            // 2. Enriquecer Contexto
            // Fusionamos el perfil guardado con el tema nuevo
            const contextoEnriquecido = {
                ...userContext,
                tema_especifico: temaUsuario
            };
            
            // 3. Ejecutar Cerebro Unificado
            // Al pasar 'null' en el segundo argumento, activamos la ruta del PROMPT V400
            const res = await ejecutarGeneradorGuiones(
                contextoEnriquecido, 
                null, 
                openai, 
                settings
            );
            
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
        Cielo: ${avatarData.cielo || 'N/A'}
        Info adicional: ${JSON.stringify(avatarData)}
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
        console.log('[TITAN] 🎯 Iniciando Auditoría de Experto...');

        let infoParaAnalizar = processedContext;

        if (!infoParaAnalizar || infoParaAnalizar.length < 50) {
          if (expertId) {
            const { data: expertData } = await supabase
              .from('expert_profiles')
              .select('*')
              .eq('id', expertId)
              .single();
            
            if (expertData) {
              infoParaAnalizar = `
                NOMBRE: ${expertData.name || 'N/A'}
                NICHO: ${expertData.niche || 'N/A'}
                MISIÓN: ${expertData.mission || 'No especificada'}
                FRAMEWORK: ${expertData.framework || 'No especificado'}
                VOCABULARIO: ${expertData.key_vocabulary || 'No especificado'}
                TONO: ${expertData.tone || 'No especificado'}
              `;
            }
          }
        }

        if (!infoParaAnalizar || infoParaAnalizar.length < 20) {
            throw new Error("No hay suficiente información del experto. Completa el perfil primero.");
        }
        
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

      case 'transcribe':
      case 'clean':
      case 'authority':
      case 'shorts':
      case 'carousel':
      case 'structure': {
        const modePrompts: Record<string, string> = {
          'clean': 'Limpia y formatea el texto corrigiendo errores.',
          'authority': 'Transforma en artículo de autoridad estilo LinkedIn.',
          'shorts': 'Extrae 3 guiones virales de 60 segundos.',
          'carousel': 'Resume en estructura de carrusel (Slide 1, 2...).',
          'structure': 'Analiza la estructura viral y sesgos psicológicos.',
          'transcribe': 'Mejora la transcripción y organiza por puntos clave.'
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
        result = { message: `Modo '${selectedMode}' desconocido`, available_modes: true };
      }
    }

    const calculatedPrice = calculateTitanCost(selectedMode, processedContext, whisperMinutes, settings);
    const finalCost = Math.max(calculatedPrice, estimatedCost || 0);

    if (finalCost > 0) {
      const { data: profile } = await supabase.from('profiles').select('credits, tier').eq('id', userId).single();
      
      if (profile?.tier !== 'admin') {
         if ((profile?.credits || 0) < finalCost) {
            throw new Error(`Saldo insuficiente. Costo: ${finalCost} créditos.`);
         }
         
         const { error: creditError } = await supabase.rpc('decrement_credits', { user_uuid: userId, amount: finalCost });
         if (creditError) console.error(`[COBROS] ❌ Error: ${creditError.message}`);
         else console.log(`[COBROS] ✅ Cobrados ${finalCost} créditos`);
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