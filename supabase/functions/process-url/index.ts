// ==================================================================================
//  🚀 TITAN ENGINE V104 - CONEXIONES TOTALMENTE BLINDADAS
// ==================================================================================
//  ✅ Todas las funciones ejecutoras corregidas
//  ✅ Switch case con llamadas correctas
//  ✅ Prompts V300 intactos (NO modificados)
//  ✅ Costos alineados con frontend
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
//  SISTEMA CEREBRAL - PROMPTS V300 (INTACTOS - NO MODIFICADOS)
// ==================================================================================

// 1️⃣ IDEAS RÁPIDAS
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

// 2️⃣ AUTOPSIA VIRAL
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
    "estructura_exacta": "PAS / Héroe / Otra",
    "formula_gancho": "[ELEMENTO 1] + [ELEMENTO 2] = Ejemplo del video"
  },
  "desglose_temporal": [
    {
      "segundo": "0-3",
      "que_pasa": "Descripción de lo que sucede en pantalla",
      "porque_funciona": "Mecanismo psicológico activado",
      "replicar_como": "Cómo aplicarlo al nicho del usuario"
    }
  ],
  "patron_replicable": {
    "nombre_patron": "Nombre descriptivo del patrón",
    "formula": "PASO 1: X + PASO 2: Y + PASO 3: Z",
    "aplicacion_generica": "Cómo cualquiera puede usar esto"
  },
  "produccion_deconstruida": {
    "visuales_clave": ["Elemento visual 1", "Elemento visual 2"],
    "ritmo_cortes": "Cada X segundos",
    "movimiento_camara": "Descripción",
    "musica_sonido": "Tipo de audio usado",
    "texto_pantalla": "Cuándo y cómo se usa"
  },
  "insights_algoritmicos": {
    "optimizacion_retencion": "Qué hace para que no pares de ver",
    "triggers_engagement": "Qué dispara interacción",
    "seo_keywords": ["Keyword 1", "Keyword 2"]
  }
}

⚠️ REGLA CRÍTICA: No describas el video, DECONSTRUYE su arquitectura.`;

// 3️⃣ GENERADOR DE GUIONES (COMPLETO - NO MODIFICADO)
const PROMPT_GENERADOR_GUIONES = (contexto: any, viralDNA: any, settings: any = {}) => {
  const dnaContext = viralDNA ? `\n\nADN VIRAL DE REFERENCIA (ESTILO A MODELAR):\n${JSON.stringify(viralDNA)}` : '';
  
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

    'pas': `
      ESTRUCTURA 'PAS' (PROBLEMA-AGITACIÓN-SOLUCIÓN):
      1. PROBLEMA (0-10s): Describe el dolor específico del avatar con detalle sangriento.
      2. AGITACIÓN (11-30s): Profundiza en las consecuencias negativas de no solucionar ese problema ahora. Haz que duela.
      3. SOLUCIÓN (31-60s): Presenta tu método/producto como la única pastilla para ese dolor.`,

    'aida': `
      ESTRUCTURA 'AIDA' (ATENCIÓN-INTERÉS-DESEO-ACCIÓN):
      1. ATENCIÓN (0-5s): Impacto visual o auditivo fuerte.
      2. INTERÉS (6-20s): Datos curiosos, estadísticas o hechos que retengan la mente lógica.
      3. DESEO (21-45s): Muestra los beneficios y la transformación soñada (el placer).
      4. ACCIÓN (46-60s): Instrucción clara y directa de qué hacer a continuación.`,

    'hso': `
      ESTRUCTURA 'HSO' (HOOK-STORY-OFFER):
      1. HOOK (0-3s): Una promesa fuerte o una declaración controversial.
      2. STORY (4-40s): Cuenta una historia personal o del héroe. (Inicio -> Conflicto -> Punto de quiebre -> Éxito).
      3. OFFER (41-60s): La lección aprendida o el recurso que ofreces como resultado de esa historia.`,
      
    'bab': `
      ESTRUCTURA 'BAB' (BEFORE-AFTER-BRIDGE):
      1. BEFORE (Antes) (0-10s): Muestra el mundo actual con el problema (infierno).
      2. AFTER (Después) (11-30s): Muestra el mundo ideal donde el problema no existe (cielo).
      3. BRIDGE (Puente) (31-60s): Tu contenido es el puente para cruzar del infierno al cielo.`
  };

  const selectedStructure = ARCHITECTURES[structureType] || ARCHITECTURES['winner_rocket'];

  return `ERES EL MEJOR GUIONISTA DE CONTENIDO VIRAL Y ESTRATEGA DE PSICOLOGÍA DE MASAS DEL MUNDO.
TU MISIÓN SUPREMA: Escribir un guion de video COMPLETO, palabra por palabra, diseñado para retener a la audiencia y convertir espectadores en seguidores.

=========================================
🎯 CONTEXTO DEL EXPERTO (CLIENTE)
=========================================
- Nicho: ${contexto.nicho || 'General'}
- Avatar Ideal: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor Principal: ${contexto.dolor_principal || 'No especificado'}
- Deseo Principal: ${contexto.deseo_principal || 'No especificado'}
- Enemigo Común: ${contexto.enemigo_comun || 'El sistema / Lo convencional'}${dnaContext}

=========================================
🧠 MATRIZ PSICOLÓGICA (CALIBRACIÓN)
=========================================
1. NIVEL DE CONCIENCIA DEL PÚBLICO: "${awarenessLevel}"
   - INSTRUCCIÓN: Adapta tu lenguaje a este nivel. Si son "Inconscientes", usa historias y metáforas. Si son "Conscientes", ve directo al grano técnico.

2. OBJETIVO DEL CONTENIDO: "${contentObjective}"
   - INSTRUCCIÓN: Si es "Inspirar", usa tono emotivo y épico. Si es "Educar", sé didáctico y claro. Si es "Persuadir", usa lógica y beneficios.

3. SITUACIÓN ACTUAL DEL AVATAR: "${avatarSituation}"
   - INSTRUCCIÓN: El guion debe validar esta emoción específica (Miedo, Deseo, Escepticismo) en los primeros 10 segundos.

=========================================
🛠️ ARQUITECTURA SELECCIONADA: ${structureType.toUpperCase()}
=========================================
Sigue ESTRICTAMENTE, paso a paso, la siguiente estructura de tiempos y contenido:
${selectedStructure}

=========================================
⚠️ REGLAS DE ORO DE ESCRITURA (NO LAS ROMPAS)
=========================================
1. **CERO RESÚMENES:** Escribe el texto EXACTO que el locutor va a leer en el teleprompter. No pongas "Explica aquí X", escribe la explicación completa.
2. **LENGUAJE NATURAL:** Usa palabras sencillas, coloquiales y emocionales. Evita la jerga corporativa aburrida. Habla de "tú a tú".
3. **FORMATO LIMPIO:** El campo "guion_completo" NO debe tener acotaciones de cámara, ni tiempos, ni [corchetes] dentro del texto hablado. Solo el texto fluido.
4. **CURIOSITY LOOPS:** Asegúrate de abrir bucles de curiosidad ("Te cuento el secreto en un momento...") para mantener la retención alta.

=========================================
SALIDA JSON REQUERIDA
=========================================
Responde ÚNICAMENTE con este objeto JSON válido:

{
  "metadata_guion": {
    "nicho": "${contexto.nicho}",
    "arquitectura_usada": "${structureType}",
    "duracion_estimada": "60-90 segundos",
    "tono_voz": "Empático y Autoritario"
  },
  "ganchos_opcionales": [
    { 
      "tipo": "Disrupción Visual", 
      "texto": "Escribe aquí una opción de primera frase muy agresiva o visual.", 
      "retencion_predicha": 95 
    },
    { 
      "tipo": "Curiosidad Intelectual", 
      "texto": "Escribe aquí una opción que empiece con una pregunta extraña o dato loco.", 
      "retencion_predicha": 92 
    }
  ],
  "guion_completo": "ESCRIBE AQUÍ EL GUION ENTERO.\\n\\nUsa saltos de línea (\\n\\n) para separar los párrafos visualmente.\\n\\nEmpieza con el Gancho.\\n\\nDesarrolla el Conflicto y la Agitación extensamente.\\n\\nEntrega la Solución con pasos claros.\\n\\nCierra con el CTA.\\n\\n(Asegúrate de que este texto tenga al menos 150-200 palabras).",
  "plan_visual": [
    { 
      "tiempo": "0-3s", 
      "accion_en_pantalla": "Describe qué se ve (ej: Primer plano rompiendo un objeto)", 
      "instruccion_produccion": "Cámara rápida / Zoom in",
      "audio": "Efecto de sonido (Glitch)"
    },
    { 
      "tiempo": "4-15s", 
      "accion_en_pantalla": "Describe el contexto (ej: Persona frustrada frente al ordenador)", 
      "instruccion_produccion": "Plano medio estático",
      "audio": "Música suave de fondo"
    },
    { 
      "tiempo": "Resto del video", 
      "accion_en_pantalla": "Describe el desarrollo de la solución hablando a cámara", 
      "instruccion_produccion": "Cámara en mano dinámica",
      "audio": "Subida de volumen música épica"
    }
  ],
  "analisis_psicologico": {
    "gatillo_mental_principal": "Ej: Autoridad",
    "emocion_objetivo": "Ej: Esperanza y Alivio"
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
- Competencia analizada: ${contexto.competencia_analizada?.length || 0} competidores

CONTENIDO A EVALUAR:
${contenido}

MATRIZ DE EVALUACIÓN (10 CRITERIOS - Puntaje 0-10 cada uno):

1. GANCHO (0-3s) - ¿Rompe el scroll? ¿Dispara curiosidad? ¿Es específico?
2. RETENCIÓN (4-30s) - ¿Mantiene micro-ganchos? ¿Ritmo dinámico?
3. RESONANCIA EMOCIONAL - ¿Toca el dolor? ¿Arco emocional claro?
4. CLARIDAD DEL MENSAJE - ¿Se entiende en 5s? ¿Lenguaje del Avatar?
5. CALL TO ACTION - ¿CTA específico? ¿Genera urgencia?
6. PRODUCCIÓN - ¿Visuales potencian? ¿Ritmo adecuado?
7. ORIGINALIDAD - ¿Concepto fresco? ¿Se diferencia?
8. POTENCIAL DE COMPARTIR - ¿Útil/entretenido? ¿Genera conversación?
9. SEÑALES ALGORÍTMICAS - ¿Optimizado para retención? ¿Keywords?
10. TIMING Y CONTEXTO - ¿Relevante ahora? ¿Momento estratégico?

FORMATO DE SALIDA JSON ESTRICTO:
{
  "veredicto_final": {
    "score_total": 85,
    "clasificacion": "ALTO POTENCIAL / MEDIO / BAJO",
    "probabilidad_viral": "78%",
    "confianza_prediccion": "92%"
  },
  "evaluacion_criterios": [
    {
      "criterio": "Gancho",
      "score": 9,
      "analisis": "El gancho rompe el patrón porque...",
      "sugerencia": "Para mejorar, considera..."
    }
  ],
  "fortalezas_clave": [
    "Fortaleza 1 con explicación",
    "Fortaleza 2 con explicación"
  ],
  "debilidades_criticas": [
    {
      "problema": "Descripción del problema",
      "impacto": "Por qué esto reduce el potencial viral",
      "solucion": "Cómo arreglarlo específicamente"
    }
  ],
  "optimizaciones_rapidas": [
    "Cambio 1 que aumentaría el score en 5 puntos",
    "Cambio 2 que aumentaría el score en 3 puntos"
  ],
  "prediccion_metricas": {
    "vistas_estimadas": "10K - 50K",
    "engagement_rate": "6% - 10%",
    "tiempo_viralizacion": "24-48 horas / 3-7 días"
  },
  "decision_recomendada": "PUBLICAR / MEJORAR ANTES DE PUBLICAR / DESCARTAR"
}

⚠️ INSTRUCCIÓN CRÍTICA: Sé brutalmente honesto. Es mejor un 6/10 real que un 9/10 falso.`;

// 5️⃣ AUDITOR DE AVATAR (INTACTO)
const PROMPT_AUDITOR_AVATAR = (infoCliente: string, nicho: string) => `ERES UN PSICÓLOGO DE CONSUMIDOR Y ESTRATEGA DE AVATARES.
TU MISIÓN: Crear el perfil más completo del Cliente Ideal para que TODO el contenido hable directo a su cerebro.

INFORMACIÓN PROPORCIONADA:
Nicho: ${nicho}
Info del cliente: ${infoCliente}

PROTOCOLO DE AUDITORÍA (10 DIMENSIONES):

1. DEMOGRÁFICOS BÁSICOS - Edad, género, ubicación, ingresos
2. PSICOGRÁFICOS - Valores, creencias, identidad aspiracional
3. SITUACIÓN ACTUAL (Dolor) - Problema principal, síntomas, frustración
4. ESTADO DESEADO (Cielo) - Vida ideal si problema desaparece
5. OBJECIONES Y MIEDOS - Qué le detiene de tomar acción
6. LENGUAJE Y JERGA - Palabras exactas que usa el Avatar
7. PLATAFORMAS Y HÁBITOS - Dónde consume contenido, cuándo
8. PROCESO DE DECISIÓN - Cómo toma decisiones, qué necesita para confiar
9. NIVEL DE CONSCIENCIA - Unaware/Problem Aware/Solution Aware/Product Aware
10. CONTENIDO QUE ENGANCHA - Ganchos, ángulos, formato preferido

FORMATO DE SALIDA JSON ESTRICTO:
{
  "resumen_avatar": {
    "nombre_avatar": "Nombre descriptivo (Ej: 'María la Emprendedora Estancada')",
    "frase_identidad": "Una frase que capture la esencia",
    "arquetipo": "Tipo psicológico"
  },
  "perfil_completo": {
    "dolor_principal": {
      "problema": "No logra generar clientes consistentemente",
      "sintomas": ["Síntoma 1", "Síntoma 2"],
      "frustracion": "Ve a otros con menos experiencia teniendo más éxito"
    },
    "estado_deseado": {
      "vision": "Tener 3-5 clientes nuevos cada mes sin perseguirlos",
      "emocion_objetivo": "Confianza y tranquilidad"
    },
    "lenguaje": {
      "palabras_clave": ["Palabra 1", "Palabra 2"],
      "frases_resuenan": ["Frase 1", "Frase 2"],
      "evitar": ["Término confuso 1"],
      "tono_preferido": "Conversacional pero experto"
    },
    "tipo_contenido_efectivo": {
      "ganchos": ["Tipo gancho 1", "Tipo gancho 2"],
      "formato": "Videos de 60-90s en vertical",
      "tono": "Directa y empoderadora"
    }
  },
  "insights_estrategicos": [
    {
      "insight": "Este Avatar valora SIMPLIFICACIÓN sobre información",
      "aplicacion": "Tu contenido debe ser 'Esto es TODO lo que necesitas'"
    }
  ]
}

⚠️ REGLA DE ORO: Un Avatar bien definido hace que TODO el contenido sea 10x más efectivo.`;

// 6️⃣ AUDITOR DE EXPERTO (INTACTO)
const PROMPT_AUDITOR_EXPERTO = (contexto: ContextoUsuario) => `ERES UN ANALISTA COMPETITIVO Y ESTRATEGA DE POSICIONAMIENTO.
TU MISIÓN: Analizar el perfil del usuario, su competencia y el mercado para encontrar su ÁNGULO ÚNICO.

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'N/A'}

PROTOCOLO DE AUDITORÍA (7 FASES):

1. MAPEO DE COMPETENCIA - Identificar top 10-20 players, categorizar por tamaño
2. ANÁLISIS DE BRECHAS - Qué hace TODO el mundo / Qué NO hace NADIE
3. DIFERENCIACIÓN - Fortalezas únicas del usuario
4. POSICIONAMIENTO - Crear declaración única
5. ESTRATEGIA DE CONTENIDO - Pilares (3-5 temas principales)
6. MATRIZ DE OPORTUNIDADES - Qué crear AHORA
7. SISTEMA DE MONITOREO - KPIs a trackear

FORMATO DE SALIDA JSON ESTRICTO:
{
  "resumen_ejecutivo": {
    "estado_mercado": "Saturado/En Crecimiento/Naciente",
    "nivel_competencia": "Alta/Media/Baja",
    "oportunidad_principal": "Descripción de la oportunidad detectada"
  },
  "analisis_brechas": {
    "todos_hacen": ["Cosa 1", "Cosa 2"],
    "nadie_hace": ["Oportunidad 1 - ANGLE VIRGEN"],
    "hacen_mal": ["Error común que comete la mayoría"]
  },
  "posicionamiento_estrategico": {
    "declaracion_posicionamiento": "Ayudo a [AVATAR] a lograr [RESULTADO] sin [OBJECIÓN] a través de [MÉTODO ÚNICO]",
    "enemigo_comun": "Qué rechaza el usuario",
    "bandera": "Por qué lucha el usuario",
    "propuesta_valor": "Una frase que capture el ÚNICO valor"
  },
  "estrategia_contenido": {
    "pilares_contenido": [
      {
        "pilar": "Pilar 1: Ej: Estrategia de Contenido",
        "objetivo": "Educar/Posicionar/Convertir",
        "frecuencia": "2-3 veces/semana",
        "angulos": ["Ángulo 1", "Ángulo 2"]
      }
    ],
    "mix_contenido": {
      "educativo": "60%",
      "entretenimiento": "20%",
      "ventas": "10%"
    }
  },
  "plan_90_dias": {
    "mes_1": {
      "objetivo": "Establecer posicionamiento y voz",
      "acciones": ["Acción 1", "Acción 2"],
      "meta_numerica": "1,000 seguidores nuevos"
    }
  }
}

⚠️ OBJETIVO: El usuario debe saber QUIÉN es en su mercado y CÓMO destacar.`;

// 7️⃣ MENTOR ESTRATÉGICO (INTACTO)
const PROMPT_MENTOR_ESTRATEGICO = (contexto: ContextoUsuario, resultados?: any) => {
  const resultadosStr = resultados ? `\n\nRESULTADOS RECIENTES:\n${JSON.stringify(resultados)}` : '';
  
  return `ERES UN MENTOR DE ÉLITE Y ESTRATEGA DE CRECIMIENTO.
TU MISIÓN: Sintetizar todos los datos, guiar con visión a largo plazo, y optimizar continuamente.

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'N/A'}
- Posicionamiento: ${contexto.posicionamiento || 'N/A'}${resultadosStr}

PROTOCOLO DE MENTORÍA (5 NIVELES):

1. DIAGNÓSTICO INTEGRAL - Revisar todos los datos, identificar patrones
2. ESTRATEGIA ADAPTATIVA - Proponer pivotes o escalamiento
3. OPTIMIZACIÓN CONTINUA - Recomendar mejoras de alto impacto
4. VISIÓN A LARGO PLAZO - Crear roadmap 6-12 meses
5. COACHING PERSONALIZADO - Feedback honesto y constructivo

FORMATO DE SALIDA JSON ESTRICTO:
{
  "diagnostico_actual": {
    "estado_general": "En camino / Necesita ajustes / Excelente",
    "score_ejecucion": 7.5,
    "areas_fuertes": [
      {
        "area": "Calidad de guiones",
        "evidencia": "Los últimos 3 guiones tienen score 8+"
      }
    ],
    "areas_debiles": [
      {
        "area": "Consistencia de publicación",
        "impacto": "Afecta visibilidad algorítmica",
        "prioridad": "Alta"
      }
    ]
  },
  "estrategia_optimizada": {
    "ajustes_inmediatos": [
      {
        "area": "Ganchos",
        "cambio": "Implementar patrón X",
        "impacto_esperado": "Alto"
      }
    ],
    "experimentos_propuestos": [
      {
        "experimento": "Testear storytelling personal",
        "hipotesis": "Mayor conexión = Mayor seguimiento",
        "metricas_evaluar": ["Engagement rate", "Shares"]
      }
    ]
  },
  "roadmap_6_meses": {
    "mes_1_2": {
      "objetivo_principal": "Validar formato",
      "acciones_clave": ["Acción 1", "Acción 2"],
      "meta_numerica": "1,000 seguidores"
    }
  },
  "sesion_coaching": {
    "reflexion": "¿Qué te está deteniendo?",
    "feedback_honesto": "Observación directa",
    "motivacion": "Mensaje inspirador"
  }
}

⚠️ ROL: GUIAR con visión, EMPODERAR con confianza, OPTIMIZAR con datos.`;
};

// ==================================================================================
// 🎯 FUNCIONES EJECUTORAS (CORREGIDAS Y BLINDADAS)
// ==================================================================================

async function ejecutarIdeasRapidas(
  userInput: string,
  contexto: ContextoUsuario,
  qty: number,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log(`[CEREBRO] 💡 Ejecutando Ideas Rápidas (Cantidad: ${qty})...`);
  
  // Creamos un prompt dinámico que solicita la cantidad exacta
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
      { role: 'system', content: 'Eres el forense de viralidad #1 del mundo.' },
      { role: 'user', content: `${PROMPT_AUTOPSIA_VIRAL(platform)}\n\nCONTENIDO A ANALIZAR:\n${content}` }
    ],
    temperature: 0.3,
    max_tokens: 4096
  });
  
  const data = JSON.parse(completion.choices[0].message.content || '{}');
  
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
  console.log('[CEREBRO] ✍️ Ejecutando Generador de Guiones...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el mejor guionista de contenido viral en español. REGLA CRÍTICA: Escribe el guion COMPLETO palabra por palabra, nunca resúmenes.' },
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
  console.log('[CEREBRO] 👤 Ejecutando Auditor de Avatar...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un psicólogo de consumidor y estratega de avatares.' },
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
  console.log('[CEREBRO] 🎯 Ejecutando Auditor de Experto...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un analista competitivo y estratega de posicionamiento.' },
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
  console.log('[CEREBRO] 📅 Generando Calendario...');
  
  const calendarPrompt = `Genera un calendario de contenidos de ${settings.duration || 7} días para el nicho: ${contexto.nicho}.
  
  Avatar: ${contexto.avatar_ideal}
  Dolor: ${contexto.dolor_principal}
  Deseo: ${contexto.deseo_principal}
  
  Usa los 40 Ganchos Winner Rocket y los 12 Formatos Visuales para crear un plan estratégico.
  
  Responde en JSON con:
  {
    "calendario": [
      {
        "dia": 1,
        "tema": "Tema del día",
        "idea_contenido": "Idea específica de video",
        "gancho_sugerido": "Primera línea del video",
        "formato": "Formato visual de los 12",
        "objetivo": "Educar/Entretener/Vender",
        "disparador": "Uno de los 7 disparadores virales"
      }
    ]
  }`;
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un estratega de contenidos CMO experto en viralidad.' },
      { role: 'user', content: calendarPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

// ==================================================================================
// CONTEXTO DE USUARIO
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
// 💰 CALCULADORA DE TARIFAS (ALINEADA CON FRONTEND)
// ==================================================================================

function calculateTitanCost(mode: string, inputContext: string, whisperMinutes: number, settings: any): number {
  
  // 1️⃣ IDEAS RÁPIDAS
  if (mode === 'ideas_rapidas') {
    if (inputContext.toLowerCase().includes("10 ideas") || settings?.quantity === 10) return 7;
    return 3; 
  }

  // 2️⃣ CALENDARIO
  if (mode === 'calendar_generator') {
    const days = settings?.duration || 7; 
    if (days <= 3) return 2;
    if (days <= 7) return 5;
    return 10;
  }

  // 3️⃣ AUTOPSIA VIRAL
  if (mode === 'autopsia_viral') {
    return 5;
  }

  // 4️⃣ RECREATE (TITAN VIRAL)
  if (mode === 'recreate') {
    if (whisperMinutes > 30) return 45; // Video Largo
    return 5; // Video Corto
  }

  // 5️⃣ GENERADOR DE GUIONES
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

  // 6️⃣ JUEZ VIRAL
  if (mode === 'juez_viral') {
    return 2;
  }

  // 7️⃣ AUDITORÍAS
  if (['audit_avatar', 'auditar_avatar'].includes(mode)) {
    return 2;
  }

  if (['audit_expert', 'auditar_experto'].includes(mode)) {
    return 2;
  }

  // 8️⃣ MENTOR / CHAT
  if (['mentor_ia', 'mentor_estrategico'].includes(mode)) {
    return 2;
  }

  if (['chat_avatar', 'chat_expert'].includes(mode)) {
    return 1;
  }

  // 9️⃣ TRANSCRIPTOR
  if (['transcribe', 'transcriptor'].includes(mode)) {
    if (whisperMinutes > 60) return 45;
    if (whisperMinutes > 30) return 15;
    return 5;
  }

  // 🔟 HERRAMIENTAS DE TEXTO
  if (['clean', 'authority', 'carousel', 'shorts', 'structure', 'ingenieria_inversa'].includes(mode)) {
    return 2;
  }

  return 1;
}

// ==================================================================================
// 🎬 SERVIDOR PRINCIPAL (SWITCH CASE CORREGIDO)
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

    console.log(`[TITAN V300] 🚀 MODE: ${selectedMode} | INPUT LEN: ${processedContext.length} | USER: ${userId}`);

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
    // 🎯 SWITCH CASE CORREGIDO (TODAS LAS LLAMADAS CORRECTAS)
    // ==================================================================================

    switch (selectedMode) {
      case 'ideas_rapidas': {
        const topic = processedContext || "Viralidad General";
        const qty = settings.quantity || 3;
        
        // ✅ LLAMADA CORRECTA con 4 parámetros
        const res = await ejecutarIdeasRapidas(topic, userContext, qty, openai);
        
        result = res.data; 
        tokensUsed = res.tokens;
        break;
      }

      case 'calendar_generator': {
        if (!settings.duration) settings.duration = 7;
        
        // ✅ LLAMADA CORRECTA
        const res = await ejecutarCalendario(settings, userContext, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      case 'autopsia_viral':
      case 'recreate': {
        const platName = platform || 'General';
        
        // ✅ LLAMADA CORRECTA (sin 'contexto' innecesario)
        const autopsiaResponse = await ejecutarAutopsiaViral(processedContext, platName, openai);
        
        if (selectedMode === 'recreate') {
            // ✅ LLAMADA CORRECTA con settings
            const guionResponse = await ejecutarGeneradorGuiones(userContext, autopsiaResponse.data.adn_extraido, openai, settings);
            result = { autopsia_viral: autopsiaResponse.data, guion_adaptado: guionResponse.data };
            tokensUsed = autopsiaResponse.tokens + guionResponse.tokens;
        } else {
            result = autopsiaResponse.data;
            tokensUsed = autopsiaResponse.tokens;
        }
        break;
      }

      case 'generar_guion': {
        // ✅ LLAMADA CORRECTA con settings
        const res = await ejecutarGeneradorGuiones(userContext, null, openai, settings);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      case 'juez_viral': {
        // ✅ LLAMADA CORRECTA
        const res = await ejecutarJuezViral(userContext, processedContext, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }
      
      case 'auditar_avatar':
      case 'audit_avatar': {
        // ✅ LLAMADA CORRECTA
        const res = await ejecutarAuditorAvatar(processedContext, userContext.nicho, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      case 'auditar_experto':
      case 'audit_expert': {
        // ✅ LLAMADA CORRECTA
        const res = await ejecutarAuditorExperto(userContext, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      case 'mentor_estrategico':
      case 'mentor_ia':
      case 'chat_expert':
      case 'chat_avatar': {
         // ✅ LLAMADA CORRECTA
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