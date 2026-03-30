// ====================================================================================
// 🔬 prompts/autopsia-viral.ts
// FUNCIÓN: Analiza UN video y extrae su ADN viral
// MODO:    autopsia_viral
// PROMPT:  PROMPT_AUTOPSIA_VIRAL  →  usado por ejecutarAutopsiaViral
// EJECUTOR: ejecutarAutopsiaViral →  handler llama: await ejecutarAutopsiaViral(...)
// HELPERS: createEmergencyStructure (fallback si GPT falla)
// NOTE:    ejecutarAutopsiaViral también es llamado internamente desde
//          ingenieria-inversa.ts cuando hay múltiples URLs
// ====================================================================================

import { delay } from '../lib/security.ts';

// ── PROMPT_AUTOPSIA_VIRAL ────────────────────────────────────────
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



// ── createEmergencyStructure (fallback) ──────────────────────────
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



// ── ejecutarAutopsiaViral ────────────────────────────────────────
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
const MAX_RETRIES = 1;

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



export {
  PROMPT_AUTOPSIA_VIRAL,
  createEmergencyStructure,
  ejecutarAutopsiaViral,
};