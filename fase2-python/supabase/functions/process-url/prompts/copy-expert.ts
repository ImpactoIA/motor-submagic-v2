// ====================================================================================
// ✍️ prompts/copy-expert.ts
// PROMPT_COPY_EXPERT_V400  →  usado por ejecutarCopyExpert
// ejecutarCopyExpert       →  handler llama: await ejecutarCopyExpert(...)
// getExpertLanguage        →  helper interno del prompt
// getCopyStrategy          →  helper interno del prompt
// ====================================================================================

import { CopyExpertSettings } from '../lib/types.ts';

// ── helpers de copy ──────────────────────────────────────────────
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

// ── PROMPT_COPY_EXPERT_V400 ──────────────────────────────────────
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


// ── ejecutarCopyExpert ───────────────────────────────────────────
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


export {
  PROMPT_COPY_EXPERT_V400,
  getExpertLanguage,
  getCopyStrategy,
  ejecutarCopyExpert,
};