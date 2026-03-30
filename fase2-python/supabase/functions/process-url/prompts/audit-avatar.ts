// ====================================================================================
// 👤 prompts/audit-avatar.ts
// PROMPT_AUDITOR_AVATAR  →  usado por ejecutarAuditorAvatar
// ejecutarAuditorAvatar  →  handler llama: await ejecutarAuditorAvatar(...)
// ====================================================================================

// ── PROMPT_AUDITOR_AVATAR ────────────────────────────────────────
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


// ── ejecutarAuditorAvatar ────────────────────────────────────────
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


export {
  PROMPT_AUDITOR_AVATAR,
  ejecutarAuditorAvatar,
};